import Image from "next/image";
import type { CSSProperties } from "react";
import type { ConvidadaLp } from "@/content/lp";
import { atraso } from "./Titulo";

export const Destaque = ({ pessoa }: { pessoa: ConvidadaLp }) => (
  <div className="relative mx-auto mt-16 grid max-w-5xl items-center gap-10 md:grid-cols-[1.05fr_1fr] md:gap-16">
    <div data-revelar="cortina" className="borda-metal relative aspect-[4/5] overflow-hidden rounded-t-full p-2">
      <div className="relative h-full w-full overflow-hidden rounded-t-full">
        {pessoa.foto && (
          <Image
            src={pessoa.foto}
            alt={`${pessoa.nome} ${pessoa.sobrenome}`}
            fill
            sizes="(min-width: 768px) 45vw, 90vw"
            className="paralaxe scale-110 object-cover object-top"
            style={{ "--fator": "-0.06" } as CSSProperties}
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-bordo-deep/50 via-transparent to-transparent" />
      </div>
    </div>
    <div data-revelar="direita" style={atraso(200)} className="text-center md:text-left">
      <p className="inline-flex items-center gap-3 rounded-full border border-rose/40 px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.3em] text-rose-light">
        <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose" />
        Convidada especial
      </p>
      <p className="mt-8 font-sans text-sm uppercase tracking-[0.35em] text-blush/70">{pessoa.nome}</p>
      <p className="text-metal mt-1 font-serif text-7xl uppercase leading-none tracking-[0.04em] md:text-8xl">{pessoa.sobrenome}</p>
      <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-rose/60 md:mx-0" />
      <p className="mt-6 font-sans text-xs uppercase tracking-[0.3em] text-blush">{pessoa.papel}</p>
      <p className="mt-6 max-w-md font-serif text-2xl leading-snug text-blush/80 italic">
        Influência e empreendedorismo na mesma trajetória.
      </p>
    </div>
  </div>
);
