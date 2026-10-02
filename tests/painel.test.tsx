import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import Painel from "@/app/painel/page";
import { listarPatrocinios, redisConfigurado } from "@/lib/redis";

vi.mock("next/headers", () => ({ headers: vi.fn(), cookies: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound: vi.fn(() => { throw new Error("Acesso negado"); }) }));
vi.mock("@/lib/redis", () => ({ listarPatrocinios: vi.fn(), redisConfigurado: vi.fn() }));

beforeEach(() => {
  vi.stubEnv("ADMIN_TOKEN", "token-administrativo-exclusivo-de-teste");
  const autorizacao = "Bearer token-administrativo-exclusivo-de-teste";
  vi.mocked(headers).mockResolvedValue(new Headers({ authorization: autorizacao }) as Awaited<ReturnType<typeof headers>>);
  vi.mocked(cookies).mockResolvedValue({ get: () => undefined } as unknown as Awaited<ReturnType<typeof cookies>>);
  vi.mocked(redisConfigurado).mockReturnValue(true);
});
afterEach(() => { vi.clearAllMocks(); vi.unstubAllEnvs(); });

describe("painel", () => {
  it("nega acesso antes de ler qualquer pedido", async () => {
    vi.mocked(headers).mockResolvedValue(new Headers() as Awaited<ReturnType<typeof headers>>);
    await expect(Painel({ searchParams: Promise.resolve({}) })).rejects.toThrow("Acesso negado");
    expect(notFound).toHaveBeenCalled();
    expect(listarPatrocinios).not.toHaveBeenCalled();
  });

  it("mostra pedidos salvos com contato e próxima página", async () => {
    vi.mocked(listarPatrocinios).mockResolvedValue({ total: 26, pedidos: [{
      id: "1", criadoEm: "2026-10-02T12:00:00Z", nome: "Ana & Júlia", empresa: "Decol",
      whatsapp: "5543999990000", mensagem: "Quero conhecer as cotas.",
    }] });
    const html = renderToStaticMarkup(await Painel({ searchParams: Promise.resolve({}) }));
    expect(html).toContain("Ana &amp; Júlia");
    expect(html).toContain("Decol");
    expect(html).toContain("Quero conhecer as cotas.");
    expect(html).toContain("https://wa.me/5543999990000?text=");
    expect(html).toMatch(/href="\/painel\/?\?pagina=2"/);
    expect(html).toContain("Página 1 de 2");
  });

  it("distingue banco vazio de falha de conexão", async () => {
    vi.mocked(listarPatrocinios).mockResolvedValue({ total: 0, pedidos: [] });
    let html = renderToStaticMarkup(await Painel({ searchParams: Promise.resolve({}) }));
    expect(html).toContain("Nenhum pedido recebido ainda.");
    vi.mocked(listarPatrocinios).mockRejectedValue(new Error("Falha de conexão"));
    html = renderToStaticMarkup(await Painel({ searchParams: Promise.resolve({}) }));
    expect(html).toContain("Não foi possível carregar os pedidos.");
    expect(html).not.toContain("Nenhum pedido recebido ainda.");
  });
});
