import { after } from "next/server";
import { isPublicPath, type BrowserMetaEventName } from "@/lib/meta-events";
import { allowMetaBrowserEvent, metaConversionsConfigured, sendMetaConversion } from "@/lib/meta-conversions";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  const headers = { "Cache-Control": "no-store" };
  const origin = new URL(request.url).origin;
  if (request.headers.get("origin") !== origin) return new Response(null, { status: 403, headers });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return new Response(null, { status: 415, headers });
  let input: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return new Response(null, { status: 400, headers });
    const parts: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 2048) {
        await reader.cancel();
        return new Response(null, { status: 413, headers });
      }
      parts.push(value);
    }
    input = JSON.parse(Buffer.concat(parts).toString("utf8"));
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error();
    if (!["PageView", "Contact", "InteressePatrocinio"].includes(input.eventName as string)
      || typeof input.eventId !== "string" || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(input.eventId)
      || typeof input.eventSourceUrl !== "string") throw new Error();
    const source = new URL(input.eventSourceUrl);
    if (source.origin !== origin || !isPublicPath(source.pathname) || source.username || source.password) throw new Error();
    const event = {
      eventName: input.eventName as BrowserMetaEventName,
      eventId: input.eventId,
      eventSourceUrl: `${source.origin}${source.pathname}`,
    };
    if (metaConversionsConfigured()) after(async () => {
      if (await allowMetaBrowserEvent(request, event)) await sendMetaConversion(request, event);
    });
  } catch {
    return new Response(null, { status: 400, headers });
  }
  return new Response(null, { status: 202, headers });
};
