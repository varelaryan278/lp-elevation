// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Interesse } from "@/components/evento/Interesse";
import { IntentLink } from "@/components/ui/IntentLink";
import { setIntent } from "@/lib/intent";
import { flushPixelEvents } from "@/lib/meta-pixel";

beforeEach(() => { vi.stubGlobal("navigator", { sendBeacon: vi.fn().mockReturnValue(true) }); });

afterEach(() => {
  cleanup();
  window.location.hash = "";
  setIntent(null);
  window.fbq = vi.fn();
  flushPixelEvents();
  delete window.fbq;
  vi.unstubAllGlobals();
});

const preencher = () => {
  const campos = { nome: "Ana", empresa: "Decol", whatsapp: "43999990000", mensagem: "Quero conhecer as cotas." };
  for (const [nome, valor] of Object.entries(campos)) {
    fireEvent.change(document.querySelector(`[name="${nome}"]`)!, { target: { value: valor } });
  }
};

describe("Interesse", () => {
  it("registra interesse ao abrir o formulário de patrocínio", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    render(<Interesse />);
    fireEvent.click(screen.getByRole("button", { name: "Quero patrocinar" }));
    expect(fbq.mock.calls).toEqual([["trackCustom", "InteressePatrocinio", {}, { eventID: expect.any(String) }]]);
  });

  it("abre o grupo diretamente sem pedir dados pessoais", () => {
    render(<Interesse />);
    const link = screen.getByRole("link", { name: "Entrar no grupo" });
    expect(link.getAttribute("href")).toBe("https://chat.whatsapp.com/I2lDDGTGJVKEexKVmnX7iw");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(document.querySelector("form")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Quero patrocinar" }));
    expect(screen.getByLabelText("Empresa")).toBeTruthy();
  });

  it("abre o formulário de patrocínio pelo hash e mantém acesso direto ao grupo", () => {
    window.location.hash = "#patrocinar";
    render(<Interesse />);
    expect(screen.getByLabelText("Empresa")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Entrar no grupo" }).getAttribute("href")).toContain("chat.whatsapp.com");
  });

  it("abre o formulário ao clicar em Patrocinar na mesma página", () => {
    render(<><IntentLink href="/evento#patrocinar" intent="patrocinar">Patrocinar</IntentLink><Interesse /></>);
    fireEvent.click(screen.getByRole("link", { name: "Patrocinar" }));
    expect(screen.getByLabelText("Empresa")).toBeTruthy();
  });

  it("aguarda o salvamento antes de confirmar o envio", async () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    let concluir!: (valor: Response) => void;
    const fetch = vi.fn().mockImplementation(() => new Promise<Response>((resolve) => { concluir = resolve; }));
    vi.stubGlobal("fetch", fetch);
    window.location.hash = "#patrocinar";
    render(<Interesse />);
    preencher();
    fireEvent.submit(document.querySelector("form")!);
    expect(screen.queryByRole("status")).toBeNull();
    expect(fbq).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Enviando…" }).hasAttribute("disabled")).toBe(true);
    expect(fetch).toHaveBeenCalledWith("/api/patrocinios/", expect.objectContaining({ method: "POST" }));
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchObject({ nome: "Ana", empresa: "Decol", whatsapp: "43999990000" });
    await act(async () => { concluir(Response.json({ salvo: true, eventId: "6c322bab-3148-458b-9893-446b18d9526f" }, { status: 201 })); });
    expect(screen.getByRole("status").textContent).toContain("Recebemos seu pedido de patrocínio.");
    expect(document.querySelector("form")).toBeNull();
    expect(fbq.mock.calls).toEqual([["track", "Lead", { content_name: "Patrocinio" }, { eventID: "6c322bab-3148-458b-9893-446b18d9526f" }]]);
  });

  it("mantém os dados preenchidos se o armazenamento falha", async () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ erro: "Tente novamente." }, { status: 503 })));
    window.location.hash = "#patrocinar";
    render(<Interesse />);
    preencher();
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("Tente novamente."));
    expect((screen.getByLabelText("Nome") as HTMLInputElement).value).toBe("Ana");
    expect(screen.queryByRole("status")).toBeNull();
    expect(fbq).not.toHaveBeenCalled();
  });
});
