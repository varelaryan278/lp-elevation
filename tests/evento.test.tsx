import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Convidadas } from "@/components/evento/Convidadas";
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
});

describe("Convidadas", () => {
  it("não renderiza nada com lista vazia", () => {
    expect(renderToStaticMarkup(<Convidadas convidadas={[]} />)).toBe("");
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
