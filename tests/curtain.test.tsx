// @vitest-environment jsdom
import { StrictMode } from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Cortina as Curtain } from "@/components/lp/Cortina";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Cortina de abertura", () => {
  it("remove a sobreposição mesmo sem eventos de animação", () => {
    vi.useFakeTimers();
    const { container } = render(<StrictMode><Curtain /></StrictMode>);
    expect(container.querySelector(".curtain")).not.toBeNull();
    act(() => vi.advanceTimersByTime(3000));
    expect(container.querySelector(".curtain")).toBeNull();
  });

  it("cancela a remoção agendada ao desmontar", () => {
    vi.useFakeTimers();
    const { unmount } = render(<Curtain />);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
