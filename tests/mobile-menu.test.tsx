// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MobileMenu } from "@/components/layout/MobileMenu";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

const items = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
];

afterEach(() => {
  cleanup();
  pathname = "/";
});

describe("MobileMenu", () => {
  it("oferece acesso direto ao grupo e fecha o menu ao clicar", () => {
    render(<MobileMenu items={items} />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
    const link = screen.getByRole("link", { name: "Entrar no grupo" });
    expect(link.getAttribute("href")).toBe("https://chat.whatsapp.com/I2lDDGTGJVKEexKVmnX7iw");
    expect(link.getAttribute("target")).toBe("_blank");
    fireEvent.click(link);
    expect(screen.queryByRole("link", { name: "Entrar no grupo" })).toBeNull();
  });

  it("fecha quando a rota muda por fora (logo, voltar/avançar)", () => {
    const { rerender } = render(<MobileMenu items={items} />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(screen.getByRole("link", { name: "Sobre" })).toBeTruthy();

    pathname = "/sobre";
    rerender(<MobileMenu items={items} />);

    expect(screen.queryByRole("link", { name: "Sobre" })).toBeNull();
    expect(screen.getByRole("button", { name: "Abrir menu" })).toBeTruthy();
  });
});
