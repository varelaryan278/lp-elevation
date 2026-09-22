import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

describe("Section", () => {
  it("aplica fundo e texto por variante", () => {
    const html = renderToStaticMarkup(<Section bg="cream">x</Section>);
    expect(html).toContain("bg-cream");
    expect(html).toContain("text-ink");
  });

  it("usa texto cream em fundos escuros", () => {
    for (const bg of ["ink", "wine", "plum"] as const) {
      expect(renderToStaticMarkup(<Section bg={bg}>x</Section>)).toContain("text-cream/90");
    }
  });

  it("propaga id pra âncora", () => {
    expect(renderToStaticMarkup(<Section bg="ink" id="interesse">x</Section>)).toContain('id="interesse"');
  });
});

describe("Eyebrow", () => {
  it("usa tracking largo e gold", () => {
    const html = renderToStaticMarkup(<Eyebrow>Conexão</Eyebrow>);
    expect(html).toContain("tracking-[0.25em]");
    expect(html).toContain("text-gold");
  });
});
