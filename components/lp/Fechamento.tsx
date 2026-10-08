import Image from "next/image";
import { evento, loteAtual } from "@/content/evento";
import { lp } from "@/content/lp";
import { CtaCompra, CtaGrupo } from "./Cta";

export const Fechamento = () => (
  <section className="relative isolate overflow-hidden bg-bordo-deep px-5 py-28 text-center md:py-40">
    <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,#5c1426,#170509_65%)]" />
    <Image
      src="/img/lp/monograma.webp"
      alt=""
      width={565}
      height={682}
      className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[28rem] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
    />
    <p data-revelar className="font-sans text-[11px] uppercase tracking-[0.35em] text-rose">
      {evento.dataLabel} · {lp.diaSemana} · {lp.hora}
    </p>
    <h2 data-revelar className="mx-auto mt-8 max-w-4xl font-serif text-5xl leading-[1.05] text-blush md:text-7xl">
      Sua cadeira está <em className="text-metal not-italic">esperando.</em>
    </h2>
    <div data-revelar className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <CtaCompra className="w-full max-w-xs sm:w-auto">
        Garantir minha vaga{loteAtual ? ` · ${loteAtual.valor}` : ""}
      </CtaCompra>
      <CtaGrupo className="w-full max-w-xs sm:w-auto">Entrar no grupo gratuito</CtaGrupo>
    </div>
  </section>
);
