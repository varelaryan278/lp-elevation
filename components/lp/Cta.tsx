import type { ReactNode } from "react";
import { compraHref } from "@/content/lp";
import { marca } from "@/content/marca";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full px-8 py-4 font-sans text-xs font-medium uppercase tracking-[0.22em] transition-transform duration-300 hover:-translate-y-0.5";

const externo = (href: string) => (href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {});

type Props = { children: ReactNode; className?: string };

export const CtaCompra = ({ children, className = "" }: Props) => (
  <a
    href={compraHref}
    {...externo(compraHref)}
    className={`${base} bg-metal text-bordo-deep shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] ${className}`}
  >
    {children}
    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
  </a>
);

export const CtaGrupo = ({ children, className = "" }: Props) => (
  <a
    href={marca.grupoWhatsapp}
    target="_blank"
    rel="noopener noreferrer"
    className={`${base} border border-rose/50 text-rose-light hover:border-rose-light hover:bg-rose-light/5 ${className}`}
  >
    {children}
  </a>
);
