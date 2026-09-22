// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Interesse } from "@/components/evento/Interesse";
import { IntentLink } from "@/components/ui/IntentLink";
import { setIntent } from "@/lib/intent";

afterEach(() => {
  cleanup();
  window.location.hash = "";
  setIntent(null);
  vi.restoreAllMocks();
});

const preencher = (campos: Record<string, string>) => {
  for (const [nome, valor] of Object.entries(campos)) {
    fireEvent.change(document.querySelector(`[name="${nome}"]`)!, { target: { value: valor } });
  }
};

describe("Interesse", () => {
  it("começa em participar e troca pra patrocinar pelo botão", () => {
    render(<Interesse numero="5543000000000" dataLabel="12/10" />);
    expect(screen.getByPlaceholderText("Cidade")).toBeTruthy();
    expect(screen.queryByPlaceholderText("Empresa")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Quero patrocinar" }));

    expect(screen.getByPlaceholderText("Empresa")).toBeTruthy();
    expect(screen.queryByPlaceholderText("Cidade")).toBeNull();
  });

  it("abre em patrocinar quando a URL tem #patrocinar", () => {
    window.location.hash = "#patrocinar";
    render(<Interesse numero="5543000000000" dataLabel="12/10" />);
    expect(screen.getByPlaceholderText("Empresa")).toBeTruthy();
  });

  it("troca de modo quando um CTA de intenção é clicado na mesma página", () => {
    render(
      <>
        <IntentLink href="/evento#patrocinar" intent="patrocinar">
          Patrocinar
        </IntentLink>
        <IntentLink href="/evento#interesse" intent="participar">
          Garantir vaga
        </IntentLink>
        <Interesse numero="5543000000000" dataLabel="12/10" />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Quero participar" }));
    fireEvent.click(screen.getByRole("link", { name: "Patrocinar" }));
    expect(screen.getByPlaceholderText("Empresa")).toBeTruthy();

    fireEvent.click(screen.getByRole("link", { name: "Garantir vaga" }));
    expect(screen.getByPlaceholderText("Cidade")).toBeTruthy();
  });

  it("envia a mensagem de patrocínio pro WhatsApp", () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    render(<Interesse numero="5543000000000" dataLabel="12/10" />);
    fireEvent.click(screen.getByRole("button", { name: "Quero patrocinar" }));
    preencher({ nome: "Ana", empresa: "Decol", whatsapp: "43999990000", mensagem: "Cotas?" });

    fireEvent.submit(document.querySelector("form")!);

    const url = String(open.mock.calls[0][0]);
    expect(url.startsWith("https://wa.me/5543000000000?text=")).toBe(true);
    expect(decodeURIComponent(new URL(url).searchParams.get("text") ?? "")).toBe(
      "Olá! Tenho interesse em patrocinar o Elevation 12/10. Nome: Ana | Empresa: Decol | WhatsApp: 43999990000 | Mensagem: Cotas?",
    );
  });
});
