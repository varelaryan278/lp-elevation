import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as metaPOST } from "@/app/api/meta/events/route";
import { POST as sponsorPOST } from "@/app/api/patrocinios/route";
import { sendMetaConversion } from "@/lib/meta-conversions";

const background = vi.hoisted(() => [] as (() => Promise<unknown>)[]);
vi.mock("next/server", async (importOriginal) => ({
  ...await importOriginal<typeof import("next/server")>(),
  after: (callback: () => Promise<unknown>) => background.push(callback),
}));

const eventId = "6c322bab-3148-458b-9893-446b18d9526f";
const event = { eventName: "GroupLead" as const, eventId, eventSourceUrl: "https://elevation.com.br/evento/" };
const request = (body: unknown = event, options: { origin?: string; type?: string } = {}) => new Request("https://elevation.com.br/api/meta/events/", {
  method: "POST",
  headers: {
    Origin: options.origin ?? "https://elevation.com.br", "Content-Type": options.type ?? "application/json",
    "User-Agent": "test-browser", "x-vercel-forwarded-for": "203.0.113.12",
    Cookie: "_fbp=fb.1.1728000000000.123; _fbc=fb.1.1728000000000.click-id; elevation_admin=private-session",
  },
  body: JSON.stringify(body),
});
const runBackground = async () => {
  for (const callback of background.splice(0)) await callback();
};

beforeEach(() => {
  background.length = 0;
  vi.stubEnv("META_CONVERSIONS_ACCESS_TOKEN", "private-meta-test-token");
  vi.stubEnv("META_CONVERSIONS_TEST_EVENT_CODE", "");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
  vi.stubEnv("VERCEL", "1");
});
afterEach(() => {
  vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks();
});

describe("API de Conversões", () => {
  it("envia o ID de deduplicação e dados de atribuição sem incluir dados pessoais do formulário ou cookies privados", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ events_received: 1 }));
    vi.stubGlobal("fetch", fetch);
    expect(await sendMetaConversion(request(), event)).toBe(true);
    expect(fetch.mock.calls[0][0]).toBe("https://graph.facebook.com/v26.0/2593484331065033/events");
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body.access_token).toBe("private-meta-test-token");
    expect(body.data).toEqual([{
      event_name: "Lead", event_id: eventId, event_time: expect.any(Number),
      action_source: "website", event_source_url: event.eventSourceUrl,
      user_data: {
        client_user_agent: "test-browser", client_ip_address: "203.0.113.12",
        fbp: "fb.1.1728000000000.123", fbc: "fb.1.1728000000000.click-id",
      },
      custom_data: { content_name: "Grupo WhatsApp" },
    }]);
    expect(JSON.stringify(body)).not.toContain("private-session");
    expect(fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
    expect(fetch.mock.calls[0][1].cache).toBe("no-store");
  });

  it("permite testar recebimento sem gerar eventos reais quando há código de teste", async () => {
    vi.stubEnv("META_CONVERSIONS_TEST_EVENT_CODE", "TEST123");
    const fetch = vi.fn().mockResolvedValue(Response.json({ events_received: 1 }));
    vi.stubGlobal("fetch", fetch);
    await sendMetaConversion(request(), event);
    expect(JSON.parse(fetch.mock.calls[0][1].body).test_event_code).toBe("TEST123");
  });

  it("desativa o envio sem token e ignora IP encaminhado em hospedagens não confiáveis", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ events_received: 1 }));
    vi.stubGlobal("fetch", fetch);
    vi.stubEnv("META_CONVERSIONS_ACCESS_TOKEN", "");
    expect(await sendMetaConversion(request(), event)).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
    vi.stubEnv("META_CONVERSIONS_ACCESS_TOKEN", "private-meta-test-token");
    vi.stubEnv("VERCEL", "");
    await sendMetaConversion(request(), event);
    expect(JSON.parse(fetch.mock.calls[0][1].body).data[0].user_data.client_ip_address).toBeUndefined();
  });

  it.each(["network", "http", "invalid-response"])("trata falha %s sem divulgar o token nos logs", async (failure) => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetch = vi.fn();
    if (failure === "network") fetch.mockRejectedValue(new Error("private-meta-test-token"));
    else fetch.mockResolvedValue(Response.json({ error: { message: "private-meta-test-token" } }, { status: failure === "http" ? 401 : 200 }));
    vi.stubGlobal("fetch", fetch);
    expect(await sendMetaConversion(request(), event)).toBe(false);
    expect(JSON.stringify(warn.mock.calls)).not.toContain("private-meta-test-token");
  });
});

describe("endpoint de eventos do navegador", () => {
  it("envia visitas como PageView e cliques no grupo como Lead após responder", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ events_received: 1 }));
    vi.stubGlobal("fetch", fetch);
    for (const eventName of ["PageView", "GroupLead"]) {
      const response = await metaPOST(request({ ...event, eventName, eventSourceUrl: `${event.eventSourceUrl}?token=private#hash` }));
      expect(response.status).toBe(202);
      expect(response.headers.get("Cache-Control")).toBe("no-store");
    }
    expect(fetch).not.toHaveBeenCalled();
    await runBackground();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetch.mock.calls[0][1].body).data[0].event_source_url).toBe(event.eventSourceUrl);
    expect(JSON.parse(fetch.mock.calls[0][1].body).data[0].event_name).toBe("PageView");
    expect(JSON.parse(fetch.mock.calls[1][1].body).data[0]).toMatchObject({ event_name: "Lead", event_id: eventId, custom_data: { content_name: "Grupo WhatsApp" } });
  });

  it.each([
    null, [], { ...event, eventName: "Lead" }, { ...event, eventName: "Purchase" },
    { ...event, eventName: "InteressePatrocinio" }, { ...event, eventName: "Contact" },
    { ...event, eventId: "invalid" }, { ...event, eventSourceUrl: "https://outro.com/" },
    { ...event, eventSourceUrl: "https://elevation.com.br/painel/" },
  ])("rejeita payload inválido %# sem agendar conversões", async (body) => {
    expect((await metaPOST(request(body))).status).toBe(400);
    expect(background).toHaveLength(0);
  });

  it("rejeita outros sites, outros formatos e corpos grandes", async () => {
    expect((await metaPOST(request(event, { origin: "https://outro.com" }))).status).toBe(403);
    expect((await metaPOST(request(event, { type: "text/plain" }))).status).toBe(415);
    expect((await metaPOST(request({ ...event, ignored: "a".repeat(2048) }))).status).toBe(413);
    expect(background).toHaveLength(0);
  });

  it("usa Redis para limitar eventos e não reenvia eventos duplicados", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://exemplo.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "redis-test-token");
    const fetch = vi.fn().mockResolvedValue(Response.json({ result: 0 }));
    vi.stubGlobal("fetch", fetch);
    expect((await metaPOST(request())).status).toBe(202);
    await runBackground();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe("https://exemplo.upstash.io");
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toContain(`elevation:meta:evento:GroupLead:${eventId}`);
  });
});

describe("lead de patrocínio", () => {
  const sponsorRequest = () => new Request("https://elevation.com.br/api/patrocinios/", {
    method: "POST", headers: { Origin: "https://elevation.com.br", "Content-Type": "application/json", "User-Agent": "test-browser" },
    body: JSON.stringify({ nome: "Ana", empresa: "Decol", whatsapp: "43999990000", mensagem: "Quero patrocinar." }),
  });
  const configureRedis = () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://exemplo.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "redis-test-token");
  };

  it("responde após salvar e compartilha com o navegador o ID enviado à Meta", async () => {
    configureRedis();
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({ result: 1 })).mockResolvedValueOnce(Response.json({ events_received: 1 }));
    vi.stubGlobal("fetch", fetch);
    const response = await sponsorPOST(sponsorRequest());
    expect(response.status).toBe(201);
    const result = await response.json();
    expect(result.eventId).toBeTruthy();
    expect(fetch).toHaveBeenCalledTimes(1);
    await runBackground();
    const body = JSON.parse(fetch.mock.calls[1][1].body);
    expect(body.data[0]).toMatchObject({ event_name: "Lead", event_id: result.eventId, custom_data: { content_name: "Patrocinio" } });
    expect(JSON.stringify(body)).not.toMatch(/Ana|Decol|43999990000|Quero patrocinar/);
  });

  it.each([0, -1])("não gera lead quando Redis retorna %s", async (redisResult) => {
    configureRedis();
    const fetch = vi.fn().mockResolvedValue(Response.json({ result: redisResult }));
    vi.stubGlobal("fetch", fetch);
    const response = await sponsorPOST(sponsorRequest());
    expect(response.status).toBe(redisResult === 0 ? 201 : 429);
    expect((await response.json()).eventId).toBeUndefined();
    expect(background).toHaveLength(0);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("mantém a confirmação de salvamento quando a Meta falha", async () => {
    configureRedis();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({ result: 1 })).mockRejectedValueOnce(new Error("private-meta-test-token"));
    vi.stubGlobal("fetch", fetch);
    const response = await sponsorPOST(sponsorRequest());
    await runBackground();
    expect(response.status).toBe(201);
    expect(await response.text()).not.toContain("private-meta-test-token");
  });
});
