// @vitest-environment jsdom
import { runInNewContext } from "node:vm";
import { StrictMode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ScriptProps } from "next/script";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { marca } from "@/content/marca";
import { flushPixelEvents } from "@/lib/meta-pixel";

const router = vi.hoisted(() => ({ pathname: "/" }));
const scriptState = vi.hoisted(() => ({ onReady: undefined as (() => void) | undefined }));
vi.mock("next/navigation", () => ({ usePathname: () => router.pathname }));
vi.mock("next/script", () => ({
  default: ({ id, children, onReady }: ScriptProps) => {
    scriptState.onReady = onReady;
    return <script id={id}>{children}</script>;
  },
}));

beforeEach(() => {
  router.pathname = "/";
  vi.stubGlobal("navigator", { sendBeacon: vi.fn().mockReturnValue(true) });
});
afterEach(() => {
  cleanup();
  window.fbq = vi.fn();
  flushPixelEvents();
  delete window.fbq;
  vi.unstubAllGlobals();
  document.querySelectorAll('script[src*="connect.facebook.net"]').forEach((script) => script.remove());
});

describe("MetaPixel", () => {
  it("inicializa o pixel fornecido e enfileira a primeira visita uma vez", () => {
    render(<StrictMode><MetaPixel /></StrictMode>);
    const script = document.getElementById("meta-pixel")!;
    const context = { window, document, get fbq() { return window.fbq; } };
    runInNewContext(script.textContent!, context);
    act(() => scriptState.onReady?.());
    act(() => scriptState.onReady?.());

    const fbq = window.fbq as typeof window.fbq & { queue: IArguments[] };
    expect(fbq.queue.map((call) => Array.from(call))).toEqual([
      ["init", "2593484331065033"],
      ["track", "PageView", {}, { eventID: expect.any(String) }],
    ]);
    expect(document.querySelector('script[src="https://connect.facebook.net/en_US/fbevents.js"]')).toBeTruthy();
  });

  it("inclui o fallback para visitantes sem JavaScript no HTML do servidor", () => {
    const html = renderToStaticMarkup(<MetaPixel />);
    expect(html).toContain("<noscript><img");
    expect(html).toContain('src="https://www.facebook.com/tr?id=2593484331065033&amp;ev=PageView&amp;noscript=1"');
  });

  it("registra novas visitas na navegação interna sem duplicar a página atual", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    const { rerender } = render(<StrictMode><MetaPixel /></StrictMode>);
    act(() => scriptState.onReady?.());
    expect(fbq).toHaveBeenCalledTimes(1);
    router.pathname = "/evento/";
    rerender(<StrictMode><MetaPixel /></StrictMode>);
    expect(fbq).toHaveBeenCalledTimes(2);
    router.pathname = "/";
    rerender(<StrictMode><MetaPixel /></StrictMode>);
    expect(fbq).toHaveBeenCalledTimes(3);
    expect(fbq.mock.calls).toEqual(Array(3).fill(["track", "PageView", {}, { eventID: expect.any(String) }]));
  });

  it("gera Lead somente ao clicar no grupo, inclusive em elementos dentro do link", () => {
    const fbq = vi.fn();
    window.fbq = fbq;
    const { getByText, unmount } = render(
      <StrictMode>
        <MetaPixel />
        <a href={marca.grupoWhatsapp}><span>Grupo</span></a>
        <a href="/evento#patrocinar"><span>Patrocinar</span></a>
        <a href="/sobre">Sobre</a>
      </StrictMode>,
    );
    fbq.mockClear();
    for (const text of ["Grupo", "Patrocinar", "Sobre"]) {
      const target = getByText(text);
      target.closest("a")!.addEventListener("click", (event) => event.preventDefault());
      fireEvent.click(target);
    }
    expect(fbq.mock.calls).toEqual([
      ["track", "Lead", { content_name: "Grupo WhatsApp" }, { eventID: expect.any(String) }],
    ]);
    unmount();
    const link = document.createElement("a");
    link.href = marca.grupoWhatsapp;
    document.body.append(link);
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link);
    link.remove();
    expect(fbq).toHaveBeenCalledTimes(1);
  });

  it("permite clicar quando o pixel está bloqueado ou ainda não carregou", () => {
    const { getByText } = render(<><MetaPixel /><a href={marca.grupoWhatsapp}>Grupo</a></>);
    const link = getByText("Grupo");
    link.addEventListener("click", (event) => event.preventDefault());
    expect(() => fireEvent.click(link)).not.toThrow();
  });

  it("usa fetch com keepalive se o navegador recusar o beacon e compartilha o mesmo ID com o Pixel", () => {
    vi.stubGlobal("navigator", { sendBeacon: vi.fn().mockReturnValue(false) });
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetch);
    const fbq = vi.fn();
    window.fbq = fbq;
    render(<MetaPixel />);
    expect(fetch).toHaveBeenCalledWith("/api/meta/events/", expect.objectContaining({ keepalive: true, method: "POST" }));
    const body = JSON.parse(fetch.mock.calls[0][1].body);
    expect(body).toMatchObject({ eventName: "PageView", eventId: fbq.mock.calls[0][3].eventID });
    expect(body).not.toHaveProperty("access_token");
  });

  it("exclui o painel e volta a registrar visitas ao retornar às páginas públicas", () => {
    window.fbq = vi.fn();
    const { rerender } = render(<MetaPixel />);
    router.pathname = "/painel/";
    rerender(<MetaPixel />);
    expect(document.getElementById("meta-pixel")).toBeNull();
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(1);
    router.pathname = "/";
    rerender(<MetaPixel />);
    expect(navigator.sendBeacon).toHaveBeenCalledTimes(2);
  });
});
