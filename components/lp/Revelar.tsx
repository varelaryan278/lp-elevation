"use client";

import { useEffect, useRef, type ReactNode } from "react";

export const Revelar = ({ children }: { children: ReactNode }) => {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    el.querySelectorAll("[data-revelar]").forEach((alvo) => observador.observe(alvo));
    el.classList.add("revelar-pronto");

    const camadas = Array.from(el.querySelectorAll<HTMLElement>(".paralaxe"));
    const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let quadro = 0;
    const mover = () => {
      quadro = 0;
      const meio = window.innerHeight / 2;
      for (const camada of camadas) {
        const r = camada.parentElement!.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        camada.style.setProperty("--rolagem", String(r.top + r.height / 2 - meio));
      }
    };
    const agendar = () => {
      if (!quadro) quadro = requestAnimationFrame(mover);
    };
    if (!calmo && camadas.length) {
      mover();
      window.addEventListener("scroll", agendar, { passive: true });
    }

    return () => {
      observador.disconnect();
      window.removeEventListener("scroll", agendar);
      cancelAnimationFrame(quadro);
    };
  }, []);

  return <div ref={raiz}>{children}</div>;
};
