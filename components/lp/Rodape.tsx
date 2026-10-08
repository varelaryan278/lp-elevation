import Image from "next/image";
import { evento } from "@/content/evento";
import { lp } from "@/content/lp";
import { marca } from "@/content/marca";

export const Rodape = () => (
  <footer className="border-t border-bordo-line bg-bordo-deep px-5 pt-14 pb-32 text-center sm:pb-14">
    <Image src="/img/brand/monograma.png" alt="" width={44} height={44} className="mx-auto" />
    <p className="mt-4 font-serif text-xl uppercase tracking-[0.4em] text-blush">{marca.nome}</p>
    <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.35em] text-rose/70">{lp.rotulo}</p>
    <nav className="mt-8 flex flex-wrap justify-center gap-8 font-sans text-[11px] uppercase tracking-[0.25em] text-blush/60">
      <a href="#ingressos" className="hover:text-rose-light">Ingressos</a>
      <a href={marca.grupoWhatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-rose-light">Grupo</a>
      <a href={marca.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-rose-light">Instagram</a>
      <a href={evento.mapaUrl} target="_blank" rel="noopener noreferrer" className="hover:text-rose-light">Como chegar</a>
    </nav>
    <p className="mt-10 font-sans text-[11px] text-blush/35">
      © {new Date().getFullYear()} {marca.nome}. {marca.assinatura}.
    </p>
  </footer>
);
