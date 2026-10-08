import type { CSSProperties, ReactNode } from "react";

export const atraso = (ms: number) => ({ "--atraso": `${ms}ms` }) as CSSProperties;

type Props = { rotulo: string; children: ReactNode; centro?: boolean };

export const Titulo = ({ rotulo, children, centro = false }: Props) => (
  <div data-revelar className={centro ? "text-center" : ""}>
    <p className={`flex items-center gap-4 font-sans text-[11px] uppercase tracking-[0.35em] text-rose ${centro ? "justify-center" : ""}`}>
      <span aria-hidden className="h-px w-8 bg-rose/60" />
      {rotulo}
      {centro && <span aria-hidden className="h-px w-8 bg-rose/60" />}
    </p>
    <h2 className="subir-mascara mt-6 font-serif text-4xl leading-[1.05] text-blush sm:text-5xl md:text-6xl">
      <span className="subir" style={atraso(120)}>{children}</span>
    </h2>
  </div>
);
