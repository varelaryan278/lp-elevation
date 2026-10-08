import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NovoPage, { metadata } from "@/app/(lp)/novo/page";
import { evento, loteAtual } from "@/content/evento";
import { marca } from "@/content/marca";

describe("Página de conversão /novo", () => {
  const html = renderToStaticMarkup(<NovoPage />);

  it("leva os CTAs de compra direto ao checkout do lote atual", () => {
    expect(loteAtual).toBeDefined();
    const ctas = html.match(new RegExp(`href="${loteAtual!.checkoutUrl}" target="_blank"`, "g")) ?? [];
    expect(ctas.length).toBeGreaterThanOrEqual(4);
  });

  it("não expõe checkout de lote que não está à venda", () => {
    for (const lote of evento.lotes.filter((l) => l !== loteAtual)) {
      expect(html).not.toContain(lote.checkoutUrl);
    }
  });

  it("oferece o grupo gratuito e o Instagram", () => {
    expect(html).toContain(`href="${marca.grupoWhatsapp}"`);
    expect(html).toContain(`href="${marca.instagram}"`);
    expect(html).toContain("não garante vaga");
  });

  it("fica fora dos buscadores enquanto é prévia", () => {
    expect(metadata.robots).toMatchObject({ index: false });
  });
});
