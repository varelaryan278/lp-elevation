import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Convidadas } from "@/components/evento/Convidadas";
import { Interesse } from "@/components/evento/Interesse";
import { Lotes } from "@/components/evento/Lotes";
import { Programacao } from "@/components/evento/Programacao";

describe("Lotes", () => {
  it("só o lote disponível leva ao checkout, em nova aba", () => {
    const html = renderToStaticMarkup(
      <Lotes
        lotes={[
          { nome: "1º lote", valor: "R$ 97", status: "disponivel", checkoutUrl: "https://pay.kiwify.com.br/a" },
          { nome: "2º lote", valor: "R$ 137", status: "esgotado", checkoutUrl: "https://pay.kiwify.com.br/b" },
          { nome: "3º lote", valor: "R$ 157", status: "em-breve", checkoutUrl: "https://pay.kiwify.com.br/c" },
        ]}
      />,
    );
    expect(html).toContain("Esgotado");
    expect(html).toContain("Em breve");
    expect(html).toContain('href="https://pay.kiwify.com.br/a" target="_blank" rel="noopener noreferrer"');
    expect(html).not.toContain("pay.kiwify.com.br/b");
    expect(html).not.toContain("pay.kiwify.com.br/c");
  });
});

describe("Convidadas", () => {
  it("não renderiza nada com lista vazia", () => {
    expect(renderToStaticMarkup(<Convidadas convidadas={[]} />)).toBe("");
  });
});

describe("Interesse", () => {
  it("convida para o grupo sem formulário de inscrição", () => {
    const html = renderToStaticMarkup(<Interesse />);
    expect(html).toContain('href="https://chat.whatsapp.com/I2lDDGTGJVKEexKVmnX7iw"');
    expect(html).not.toContain("<form");
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
