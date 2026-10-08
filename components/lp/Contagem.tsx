"use client";

import { useEffect, useState } from "react";
import { inicioEvento } from "@/content/lp";

const alvo = new Date(inicioEvento).getTime();

const partes = (agora: number) => {
  const resto = Math.max(0, alvo - agora);
  return [
    { valor: Math.floor(resto / 86_400_000), rotulo: "dias" },
    { valor: Math.floor(resto / 3_600_000) % 24, rotulo: "horas" },
    { valor: Math.floor(resto / 60_000) % 60, rotulo: "min" },
    { valor: Math.floor(resto / 1000) % 60, rotulo: "seg" },
  ];
};

export const Contagem = () => {
  const [agora, setAgora] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setAgora(Date.now());
    const primeiro = setTimeout(tick, 0);
    const intervalo = setInterval(tick, 1000);
    return () => {
      clearTimeout(primeiro);
      clearInterval(intervalo);
    };
  }, []);

  if (agora === null || agora >= alvo) return null;

  return (
    <div role="timer" aria-label="Tempo até o evento" className="flex items-center justify-center gap-3 sm:gap-5">
      {partes(agora).map((p) => (
        <div key={p.rotulo} className="min-w-14 text-center">
          <p className="font-serif text-3xl tabular-nums text-blush sm:text-4xl">{String(p.valor).padStart(2, "0")}</p>
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.3em] text-rose/80">{p.rotulo}</p>
        </div>
      ))}
    </div>
  );
};
