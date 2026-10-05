import { isIP } from "node:net";
import { createHash } from "node:crypto";
import { META_PIXEL_ID, metaEvents, type MetaEventName } from "./meta-events";
import { comandoRedis, redisConfigurado } from "./redis";

export type MetaConversion = { eventName: MetaEventName; eventId: string; eventSourceUrl: string };
export const metaConversionsConfigured = () => Boolean(process.env.META_CONVERSIONS_ACCESS_TOKEN);

const clientIp = (request: Request) => {
  const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() : undefined;
  return ip && isIP(ip) ? ip : undefined;
};

export const allowMetaBrowserEvent = async (request: Request, event: MetaConversion) => {
  if (!redisConfigurado()) return true;
  const origin = createHash("sha256").update(clientIp(request) ?? "sem-ip").digest("hex");
  try {
    return await comandoRedis<number>([
      "EVAL", `
        local quantidade = redis.call('INCR', KEYS[1])
        if quantidade == 1 then redis.call('EXPIRE', KEYS[1], 60) end
        if quantidade > 120 then return 0 end
        if redis.call('SET', KEYS[2], '1', 'EX', 86400, 'NX') then return 1 end
        return 0
      `, 2, `elevation:meta:limite:${origin}`, `elevation:meta:evento:${event.eventName}:${event.eventId}`,
    ]) === 1;
  } catch {
    return false;
  }
};

export const sendMetaConversion = async (request: Request, event: MetaConversion): Promise<boolean> => {
  const token = process.env.META_CONVERSIONS_ACCESS_TOKEN;
  if (!token) return false;
  const userData: Record<string, string> = {};
  const agent = request.headers.get("user-agent");
  if (agent) userData.client_user_agent = agent.slice(0, 1024);
  const ip = clientIp(request);
  if (ip) userData.client_ip_address = ip;
  const cookies = request.headers.get("cookie") ?? "";
  for (const name of ["fbp", "fbc"]) {
    const value = cookies.split(";").map((part) => part.trim()).find((part) => part.startsWith(`_${name}=`))?.slice(name.length + 2);
    if (value && value.length <= 512 && /^fb\.\d+\.\d+\.[A-Za-z0-9_-]+$/.test(value)) userData[name] = value;
  }
  const data = {
    event_name: event.eventName,
    event_id: event.eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: event.eventSourceUrl,
    user_data: userData,
    custom_data: metaEvents[event.eventName],
  };
  try {
    const response = await fetch(`https://graph.facebook.com/v26.0/${META_PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [data], access_token: token,
        ...(process.env.META_CONVERSIONS_TEST_EVENT_CODE ? { test_event_code: process.env.META_CONVERSIONS_TEST_EVENT_CODE } : {}),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const result = await response.json() as { events_received?: number };
      if (result.events_received === 1) return true;
    }
  } catch {
    // Never log the request, response, or exception: they may contain credentials.
  }
  console.warn("Meta: não foi possível enviar o evento de conversão.");
  return false;
};
