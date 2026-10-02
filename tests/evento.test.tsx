import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Convidadas } from "@/components/evento/Convidadas";
import { Interesse } from "@/components/evento/Interesse";
import { Programacao } from "@/components/evento/Programacao";

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
