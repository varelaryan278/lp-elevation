export type Modo = "participar" | "patrocinar";

let intent: Modo | null = null;
const listeners = new Set<() => void>();

export const setIntent = (modo: Modo | null) => {
  intent = modo;
  listeners.forEach((l) => l());
};

export const subscribeIntent = (l: () => void) => {
  listeners.add(l);
  window.addEventListener("hashchange", l);
  return () => {
    listeners.delete(l);
    window.removeEventListener("hashchange", l);
  };
};

export const getIntent = (): Modo =>
  intent ?? (window.location.hash === "#patrocinar" ? "patrocinar" : "participar");

export const getServerIntent = (): Modo => "participar";
