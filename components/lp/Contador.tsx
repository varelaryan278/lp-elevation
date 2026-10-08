"use client";

import { useEffect, useRef, useState } from "react";

type Props = { valor: number; sufixo?: string };

export const Contador = ({ valor, sufixo = "" }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let quadro = 0;
    const observador = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return;
      observador.disconnect();
      const inicio = performance.now();
      const passo = (agora: number) => {
        const t = Math.min(1, (agora - inicio) / 1800);
        setAtual(Math.round(valor * (1 - Math.pow(1 - t, 3))));
        if (t < 1) quadro = requestAnimationFrame(passo);
      };
      quadro = requestAnimationFrame(passo);
    });
    const zerar = requestAnimationFrame(() => {
      if (el.getBoundingClientRect().top > window.innerHeight) setAtual(0);
      observador.observe(el);
    });
    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
      cancelAnimationFrame(zerar);
    };
  }, [valor]);

  return (
    <span ref={ref} className="tabular-nums">
      {atual}
      {sufixo}
    </span>
  );
};
