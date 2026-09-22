import { describe, expect, it } from "vitest";
import { buildMensagem, buildMensagemPatrocinio, buildWhatsAppUrl } from "@/lib/whatsapp";

describe("buildMensagemPatrocinio", () => {
  it("monta a mensagem de patrocínio com empresa e recado", () => {
    const msg = buildMensagemPatrocinio(
      { nome: "Ana Paula", empresa: "Decol Design", whatsapp: "43999990000", mensagem: "Quero saber as cotas." },
      "12/10",
    );
    expect(msg).toBe(
      "Olá! Tenho interesse em patrocinar o Elevation 12/10. Nome: Ana Paula | Empresa: Decol Design | WhatsApp: 43999990000 | Mensagem: Quero saber as cotas.",
    );
  });
});

describe("buildMensagem", () => {
  it("monta a mensagem no formato combinado", () => {
    const msg = buildMensagem(
      { nome: "Ana Paula", whatsapp: "43999990000", cidade: "Londrina", origem: "Instagram" },
      "12/10",
    );
    expect(msg).toBe(
      "Olá! Quero garantir minha vaga no Elevation 12/10. Nome: Ana Paula | WhatsApp: 43999990000 | Cidade: Londrina | Conheci por: Instagram",
    );
  });
});

describe("buildWhatsAppUrl", () => {
  it("usa wa.me com o número e a mensagem codificada", () => {
    const url = buildWhatsAppUrl("5543999140409", "Olá! Tudo bem?");
    expect(url).toBe("https://wa.me/5543999140409?text=Ol%C3%A1!%20Tudo%20bem%3F");
  });

  it("preserva caracteres reservados como &, # e +", () => {
    const url = buildWhatsAppUrl("5543999140409", "A & B #1 + C");
    expect(url).toContain("A%20%26%20B%20%231%20%2B%20C");
    expect(decodeURIComponent(new URL(url).searchParams.get("text") ?? "")).toBe("A & B #1 + C");
  });
});
