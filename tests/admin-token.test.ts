import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as entrar } from "@/app/api/admin/sessao/route";
import { POST as sair } from "@/app/api/admin/sair/route";
import { autenticarAdmin, cookieAdmin, criarSessaoAdmin, duracaoSessaoAdmin, validarSessaoAdmin } from "@/lib/admin-auth";
import { proxy } from "@/proxy";

const token = "token-administrativo-exclusivo-de-teste";
const pedido = (valor = token, origin = "https://elevation.com.br") => new Request("https://elevation.com.br/api/admin/sessao/", {
  method: "POST", headers: { Origin: origin, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token: valor }),
});
beforeEach(() => { vi.stubEnv("ADMIN_TOKEN", token); });
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("token administrativo", () => {
  it("aceita Bearer e rejeita credenciais antigas, token inválido ou curto", () => {
    expect(autenticarAdmin(`Bearer ${token}`)).toBe(true);
    expect(autenticarAdmin("Bearer incorreto")).toBe(false);
    expect(autenticarAdmin(`Basic ${Buffer.from("admin:senha").toString("base64")}`)).toBe(false);
    vi.stubEnv("ADMIN_TOKEN", "curto");
    expect(autenticarAdmin("Bearer curto")).toBe(false);
  });

  it("cria sessão sem expor o token e rejeita alteração, expiração e rotação", () => {
    vi.useFakeTimers();
    const sessao = criarSessaoAdmin();
    expect(sessao).not.toContain(token);
    expect(validarSessaoAdmin(sessao)).toBe(true);
    expect(validarSessaoAdmin(`${sessao}a`)).toBe(false);
    vi.stubEnv("ADMIN_TOKEN", "outro-token-administrativo-de-teste");
    expect(validarSessaoAdmin(sessao)).toBe(false);
    vi.stubEnv("ADMIN_TOKEN", token);
    vi.setSystemTime(Date.now() + duracaoSessaoAdmin * 1000);
    expect(validarSessaoAdmin(sessao)).toBe(false);
  });

  it("redireciona o navegador sem sessão e deixa a tela de token acessível", () => {
    const resposta = proxy(new NextRequest("https://elevation.com.br/painel/"));
    expect(resposta.headers.get("location")).toBe("https://elevation.com.br/painel/acesso/");
    expect(proxy(new NextRequest("https://elevation.com.br/painel/acesso/" )).status).toBe(200);
  });

  it("faz login com cookie privado e autoriza a próxima navegação", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const resposta = await entrar(pedido());
    expect(resposta.status).toBe(303);
    expect(resposta.headers.get("location")).toBe("https://elevation.com.br/painel/");
    const cookie = resposta.headers.get("set-cookie")!;
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=strict");
    expect(cookie).not.toContain(token);
    const credencial = cookie.split(";")[0];
    expect(credencial).toContain(cookieAdmin);
    expect(proxy(new NextRequest("https://elevation.com.br/painel/", { headers: { cookie: credencial } })).status).toBe(200);
  });

  it("não cria cookie com token incorreto e rejeita formulário de outro site", async () => {
    const resposta = await entrar(pedido("incorreto"));
    expect(resposta.headers.get("location")).toBe("https://elevation.com.br/painel/acesso/?erro=token");
    expect(resposta.headers.has("set-cookie")).toBe(false);
    expect((await entrar(pedido(token, "https://outro.com"))).status).toBe(403);
  });

  it("encerra a sessão no navegador e rejeita logout de outro site", () => {
    const resposta = sair(new Request("https://elevation.com.br/api/admin/sair/", { method: "POST", headers: { Origin: "https://elevation.com.br" } }));
    expect(resposta.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(resposta.headers.get("location")).toBe("https://elevation.com.br/painel/acesso/");
    expect(sair(new Request("https://elevation.com.br/api/admin/sair/", { method: "POST", headers: { Origin: "https://outro.com" } })).status).toBe(403);
  });
});
