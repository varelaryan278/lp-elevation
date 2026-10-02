import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/patrocinios/route";
import { autenticarAdmin } from "@/lib/admin-auth";
import { validarPatrocinio } from "@/lib/patrocinios";
import { listarPatrocinios } from "@/lib/redis";
import { proxy } from "@/proxy";
import { NextRequest } from "next/server";

const dados = { nome: "Ana", empresa: "Decol", whatsapp: "(43) 99999-0000", mensagem: "Quero conhecer as cotas." };
const request = (body: unknown = dados, origin = "https://elevation.com.br") => new Request("https://elevation.com.br/api/patrocinios/", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(body),
});
const configurar = () => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://exemplo.upstash.io");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token-de-teste");
};
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("patrocínios", () => {
  it("normaliza WhatsApp brasileiro e rejeita dados inválidos", () => {
    expect(validarPatrocinio(dados)?.whatsapp).toBe("5543999990000");
    expect(validarPatrocinio({ ...dados, whatsapp: "+55 (43) 99999-0000" })?.whatsapp).toBe("5543999990000");
    expect(validarPatrocinio({ ...dados, whatsapp: "abc43999990000" })).toBeNull();
    expect(validarPatrocinio({ ...dados, mensagem: "a" })).toBeNull();
    expect(validarPatrocinio({ ...dados, nome: "a".repeat(121) })).toBeNull();
  });

  it("rejeita pedidos de outros sites e dados inválidos antes de acessar Redis", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    expect((await POST(request(dados, "https://outro.com"))).status).toBe(403);
    expect((await POST(request({ ...dados, whatsapp: "123" }))).status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("não confirma envio quando faltam credenciais", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", ""); vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    expect((await POST(request())).status).toBe(503);
  });

  it("rejeita payloads muito grandes antes de acessar o armazenamento", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    expect((await POST(request({ ...dados, mensagem: "a".repeat(9000) }))).status).toBe(413);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("salva os dados normalizados antes de confirmar o envio", async () => {
    configurar();
    const fetch = vi.fn().mockResolvedValue(Response.json({ result: 1 })); vi.stubGlobal("fetch", fetch);
    const resposta = await POST(request());
    expect(resposta.status).toBe(201);
    expect(await resposta.json()).toEqual({ salvo: true });
    const comando = JSON.parse(fetch.mock.calls[0][1].body);
    expect(comando[0]).toBe("EVAL");
    const pedido = JSON.parse(comando[6]);
    expect(pedido).toMatchObject({ nome: "Ana", empresa: "Decol", whatsapp: "5543999990000", mensagem: dados.mensagem });
    expect(pedido.id).toBeTruthy(); expect(pedido.criadoEm).toBeTruthy();
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer token-de-teste");
  });

  it("trata duplicação sem repetir pedidos e informa o limite de envio", async () => {
    configurar();
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({ result: 0 })).mockResolvedValueOnce(Response.json({ result: -1 }));
    vi.stubGlobal("fetch", fetch);
    expect((await POST(request())).status).toBe(201);
    expect((await POST(request())).status).toBe(429);
  });

  it("retorna erro sem divulgar credenciais se o Redis falhar", async () => {
    configurar(); vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("token-de-teste")));
    const resposta = await POST(request());
    expect(resposta.status).toBe(503);
    expect(await resposta.text()).not.toContain("token-de-teste");
  });

  it("lista pedidos salvos com paginação e total", async () => {
    configurar();
    const pedido = { ...dados, id: "1", criadoEm: "2026-10-02T12:00:00Z" };
    const fetch = vi.fn().mockImplementation((_url, options) => {
      const comando = JSON.parse(options.body);
      return Promise.resolve(Response.json({ result: comando[0] === "LLEN" ? 26 : [JSON.stringify(pedido)] }));
    });
    vi.stubGlobal("fetch", fetch);
    expect(await listarPatrocinios(2)).toEqual({ total: 26, pedidos: [pedido] });
    expect(fetch.mock.calls.map((call) => JSON.parse(call[1].body))).toContainEqual(["LRANGE", "elevation:patrocinios", 25, 49]);
  });
});

describe("acesso ao painel", () => {
  it("mantém o painel fechado sem configuração ou com senha incorreta", () => {
    vi.stubEnv("ADMIN_USERNAME", "admin"); vi.stubEnv("ADMIN_PASSWORD", "");
    expect(autenticarAdmin(null)).toBe(false);
    expect(proxy(new NextRequest("https://elevation.com.br/painel/" )).status).toBe(503);
    vi.stubEnv("ADMIN_PASSWORD", "senha-longa-de-teste");
    expect(autenticarAdmin(`Basic ${Buffer.from("admin:errada").toString("base64")}`)).toBe(false);
    const resposta = proxy(new NextRequest("https://elevation.com.br/painel/"));
    expect(resposta.status).toBe(401);
    expect(resposta.headers.get("www-authenticate")).toContain("Basic");
  });

  it("permite apenas a credencial configurada e desativa cache", () => {
    vi.stubEnv("ADMIN_USERNAME", "admin"); vi.stubEnv("ADMIN_PASSWORD", "senha-longa-de-teste");
    const authorization = `Basic ${Buffer.from("admin:senha-longa-de-teste").toString("base64")}`;
    expect(autenticarAdmin(authorization)).toBe(true);
    const resposta = proxy(new NextRequest("https://elevation.com.br/painel/", { headers: { authorization } }));
    expect(resposta.status).toBe(200);
    expect(resposta.headers.get("cache-control")).toBe("private, no-store");
  });
});
