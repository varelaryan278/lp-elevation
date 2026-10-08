import Image from "next/image";
import { loteAtual } from "@/content/evento";
import { CtaCompra } from "./Cta";

const links = [
  { href: "#experiencia", label: "Experiência" },
  { href: "#convidadas", label: "Convidadas" },
  { href: "#ingressos", label: "Ingressos" },
  { href: "#duvidas", label: "Dúvidas" },
];

export const Topo = () => (
  <header className="fixed inset-x-0 top-0 z-50">
    {loteAtual && (
      <a
        href="#ingressos"
        className="block bg-metal py-2 text-center font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-bordo-deep sm:text-[11px]"
      >
        {loteAtual.nome} por {loteAtual.valor}
        <span className="hidden sm:inline"> · o valor sobe na virada de lote</span>
        <span className="sm:hidden"> · garanta antes da virada</span>
      </a>
    )}
    <div className="border-b border-bordo-line/60 bg-bordo-deep/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
        <a href="#inicio" aria-label="Elevation, topo" className="flex shrink-0 items-center gap-3">
          <Image src="/img/brand/monograma.png" alt="" width={32} height={32} priority />
          <span className="font-serif text-base uppercase tracking-[0.35em] text-blush">Elevation</span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-sans text-[11px] uppercase tracking-[0.25em] text-blush/70 transition-colors hover:text-rose-light">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden sm:block">
          <CtaCompra className="px-6 py-3">Garantir vaga</CtaCompra>
        </div>
      </div>
    </div>
  </header>
);
