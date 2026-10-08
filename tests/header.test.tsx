import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
  it("não aplica backdrop-blur no próprio <header>, senão o menu mobile fixed fica preso nos 80px", () => {
    const html = renderToStaticMarkup(<Header />);
    const headerTag = html.match(/<header[^>]*>/)?.[0] ?? "";
    expect(headerTag).not.toContain("backdrop-blur");
    expect(html).toContain("backdrop-blur");
  });

  it("prioriza o ingresso e mantém grupo e patrocínio", () => {
    const html = renderToStaticMarkup(<Header />);
    expect(html).toMatch(/href="\/evento#ingressos"[^>]*>Garantir ingresso</);
    expect(html).toContain('href="https://chat.whatsapp.com/I2lDDGTGJVKEexKVmnX7iw"');
    expect(html).toContain('href="/evento#patrocinar"');
  });
});
