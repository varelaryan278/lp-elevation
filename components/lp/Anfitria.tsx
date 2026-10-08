import Image from "next/image";
import type { CSSProperties } from "react";
import type { Anfitria as AnfitriaData } from "@/content/lp";
import { atraso } from "./Titulo";

type Props = { pessoa: AnfitriaData; invertido?: boolean };

export const Anfitria = ({ pessoa, invertido = false }: Props) => (
  <div
    className={`mx-auto grid max-w-5xl items-center gap-12 overflow-hidden rounded-[2.5rem] border border-bordo-line bg-bordo-soft p-6 md:gap-16 md:p-10 ${
      invertido ? "md:grid-cols-[1.1fr_0.9fr]" : "md:grid-cols-[0.9fr_1.1fr]"
    }`}
  >
    <div
      data-revelar="cortina"
      className={`relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] ${invertido ? "md:order-2" : ""}`}
    >
      <Image
        src={pessoa.foto}
        alt={`Retrato de ${pessoa.nome} ${pessoa.sobrenome}`}
        fill
        sizes="(min-width: 768px) 40vw, 90vw"
        className="paralaxe scale-110 object-cover object-top"
        style={{ "--fator": "-0.06" } as CSSProperties}
      />
      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-bordo-deep/60 via-transparent to-transparent" />
    </div>
    <div
      data-revelar={invertido ? "esquerda" : "direita"}
      style={atraso(200)}
      className="pb-4 text-center md:pb-0 md:text-left"
    >
      <p className="font-sans text-[11px] uppercase tracking-[0.35em] text-rose">{pessoa.rotulo}</p>
      <p className="mt-5 font-sans text-xs uppercase tracking-[0.3em] text-blush/70">{pessoa.nome}</p>
      <p className="text-metal font-serif text-6xl uppercase leading-none tracking-[0.06em] md:text-7xl">
        {pessoa.sobrenome}
      </p>
      <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-rose/60 md:mx-0" />
      <p className="mt-6 font-sans text-sm leading-relaxed text-blush/70">{pessoa.bio}</p>
      {pessoa.frase && (
        <blockquote className="mt-8 border-l border-rose/40 pl-5 text-left font-serif text-2xl leading-snug text-blush italic">
          {pessoa.frase}
        </blockquote>
      )}
    </div>
  </div>
);
