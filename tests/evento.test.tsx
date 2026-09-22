import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Convidadas } from "@/components/evento/Convidadas";
import { Interesse } from "@/components/evento/Interesse";
import { Lotes } from "@/components/evento/Lotes";
import { Programacao } from "@/components/evento/Programacao";

describe("Lotes", () => {
  it("mostra rótulo por status e só aponta pro formulário quando disponível", () => {
    const html = renderToStaticMarkup(
      <Lotes
        lotes={[
          { nome: "1º lote", valor: "R$ 197", status: "disponivel" },
          { nome: "2º lote", valor: "R$ 247", status: "esgotado" },
          { nome: "3º lote", valor: "R$ 297", status: "em-breve" },
        ]}
      />,
    );
    expect(html).toContain("Esgotado");
    expect(html).toContain("Em breve");
    expect(html.match(/href="#interesse"/g)).toHaveLength(1);
  });

  it("não apaga o card inativo inteiro, só o valor", () => {
    const html = renderToStaticMarkup(<Lotes lotes={[{ nome: "2º lote", valor: "R$ 247", status: "esgotado" }]} />);
    expect(html).not.toContain("opacity-60");
    expect(html).toMatch(/<p class="[^"]*text-cream\/50[^"]*">R\$ 247<\/p>/);
  });
});

describe("Convidadas", () => {
  it("não renderiza nada com lista vazia", () => {
    expect(renderToStaticMarkup(<Convidadas convidadas={[]} />)).toBe("");
  });
});

describe("Interesse", () => {
  it("dá nome acessível ao select de origem", () => {
    const html = renderToStaticMarkup(<Interesse numero="5543000000000" dataLabel="12/10" />);
    const select = html.match(/<select[^>]*>/)?.[0] ?? "";
    expect(select).toContain('aria-label="Como conheceu o Elevation?"');
  });
});

describe("Programacao", () => {
  it("lista horário e título de cada bloco", () => {
    const html = renderToStaticMarkup(
      <Programacao blocos={[{ horario: "14h", titulo: "Café", descricao: "Chegada." }]} />,
    );
    expect(html).toContain("14h");
    expect(html).toContain("Café");
  });
});
