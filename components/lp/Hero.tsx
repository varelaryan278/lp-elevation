import Image from "next/image";
import type { CSSProperties } from "react";
import { evento, loteAtual } from "@/content/evento";
import { especial, lp } from "@/content/lp";
import { Contagem } from "./Contagem";
import { CtaCompra, CtaGrupo } from "./Cta";

const IconeCalendario = () => (
  <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 stroke-rose" fill="none" strokeWidth="1.2">
    <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);

const IconeRelogio = () => (
  <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 stroke-rose" fill="none" strokeWidth="1.2">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

const IconeLocal = () => (
  <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 stroke-rose" fill="none" strokeWidth="1.2">
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export const Hero = () => (
  <section id="inicio" className="after-curtain relative isolate flex min-h-svh items-center overflow-hidden bg-bordo-deep pt-36 pb-20">
    <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,#5c1426_0%,#2a0810_45%,#170509_80%)]" />
    <div aria-hidden className="halo absolute top-1/4 left-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-bordo/70 blur-[120px]" />
    <div aria-hidden className="grao absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay" />
    {lp.convidadas.filter((c) => !especial(c)).slice(0, 2).map((c, i) => (
      <div
        key={c.sobrenome}
        className={`absolute top-1/2 hidden w-56 animate-fade-up xl:block ${i === 0 ? "left-10 text-left" : "right-10 text-right"}`}
        style={{ animationDelay: `calc(var(--opening) + ${900 + i * 150}ms)` }}
      >
        <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-rose">{c.nome}</p>
        <p className="mt-1 font-serif text-4xl uppercase tracking-[0.08em] text-blush">{c.sobrenome}</p>
        <span aria-hidden className={`mt-3 block h-px w-10 bg-rose/60 ${i === 0 ? "" : "ml-auto"}`} />
        <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.3em] text-blush/60">{c.papel}</p>
      </div>
    ))}
    <ul aria-hidden className="absolute top-36 left-6 hidden space-y-1 font-sans text-[10px] uppercase tracking-[0.3em] text-rose/60 lg:block">
      <li className="mb-3 h-px w-8 bg-rose/50" />
      {lp.pilares.map((p) => <li key={p}>{p}</li>)}
    </ul>
    <ul aria-hidden className="absolute top-36 right-6 hidden space-y-1 text-right font-sans text-[10px] uppercase tracking-[0.3em] text-rose/60 lg:block">
      {lp.temas.map((t) => <li key={t}>{t}</li>)}
      <li className="mt-3 ml-auto h-px w-8 bg-rose/50" />
    </ul>

    <div className="mx-auto w-full max-w-5xl px-5 text-center">
      <div className="flutua mx-auto w-24 animate-fade-up [animation-delay:var(--opening)] sm:w-28">
        <Image src="/img/lp/monograma.webp" alt="Elevation" width={565} height={682} priority className="h-auto w-full" />
      </div>
      <p className="mt-6 animate-fade-up font-serif text-3xl uppercase tracking-[0.45em] text-rose-light [animation-delay:calc(var(--opening)+120ms)] sm:text-4xl">
        Elevation
      </p>
      <p className="mt-2 animate-fade-up font-sans text-[10px] uppercase tracking-[0.4em] text-blush/70 [animation-delay:calc(var(--opening)+200ms)] sm:text-xs">
        {lp.rotulo}
      </p>
      <p className="mx-auto mt-6 inline-flex animate-fade-up items-center gap-3 rounded-full border border-rose/30 px-4 py-1.5 font-sans text-[10px] uppercase tracking-[0.3em] text-rose-light [animation-delay:calc(var(--opening)+260ms)]">
        <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose" />
        {evento.edicao}ª edição · {evento.cidade}
      </p>

      <h1 className="mt-12 animate-fade-up [animation-delay:calc(var(--opening)+320ms)]">
        <span className="block font-serif text-2xl uppercase tracking-[0.25em] text-blush sm:text-4xl">{lp.titulo.antes}</span>
        <span aria-label={lp.titulo.destaque} className="block font-serif text-[clamp(3.6rem,15vw,10rem)] leading-[0.9] font-medium uppercase">
          {Array.from(lp.titulo.destaque).map((letra, i) => (
            <span key={i} aria-hidden className="letra text-metal" style={{ "--atraso": `calc(var(--opening) + ${450 + i * 70}ms)` } as CSSProperties}>
              {letra}
            </span>
          ))}
        </span>
        <span className="mt-2 block font-serif text-xl uppercase tracking-[0.3em] text-blush sm:text-3xl">{lp.titulo.depois}</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl animate-fade-up font-sans text-xs uppercase tracking-[0.25em] text-blush/70 [animation-delay:calc(var(--opening)+420ms)]">
        {lp.subtitulo}
      </p>
      {lp.convidadas.filter(especial).map((c) => (
        <a
          key={c.sobrenome}
          href="#convidadas"
          className="mx-auto mt-8 flex w-fit animate-fade-up items-center gap-5 rounded-full border border-rose/40 bg-bordo-deep/50 py-2 pr-7 pl-2 backdrop-blur transition-colors hover:border-rose-light [animation-delay:calc(var(--opening)+500ms)]"
        >
          {c.foto && <Image src={c.foto} alt="" width={64} height={64} className="h-16 w-16 rounded-full object-cover object-top ring-1 ring-rose/60" />}
          <span className="text-left">
            <span className="block font-sans text-[10px] uppercase tracking-[0.3em] text-rose">Convidada especial</span>
            <span className="block font-serif text-2xl leading-tight text-blush">
              {c.nome} {c.sobrenome}
            </span>
          </span>
        </a>
      ))}

      <dl className="mx-auto mt-10 grid max-w-3xl animate-fade-up grid-cols-1 gap-5 text-left [animation-delay:calc(var(--opening)+520ms)] sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-rose/25">
        <div className="flex items-center gap-3 sm:justify-center sm:px-4">
          <IconeCalendario />
          <div>
            <dt className="sr-only">Data</dt>
            <dd className="font-sans text-sm uppercase tracking-[0.15em] text-blush">{evento.dataLabel}</dd>
            <dd className="font-sans text-[11px] uppercase tracking-[0.2em] text-rose/70">{lp.diaSemana}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:justify-center sm:px-4">
          <IconeRelogio />
          <div>
            <dt className="sr-only">Horário</dt>
            <dd className="font-sans text-sm uppercase tracking-[0.15em] text-blush">{lp.hora}</dd>
            <dd className="font-sans text-[11px] uppercase tracking-[0.2em] text-rose/70">{evento.horario}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:justify-center sm:px-4">
          <IconeLocal />
          <div>
            <dt className="sr-only">Local</dt>
            <dd className="font-sans text-sm uppercase tracking-[0.15em] text-blush">{evento.local}</dd>
            <dd className="font-sans text-[11px] uppercase tracking-[0.2em] text-rose/70">{lp.localDetalhe} · {evento.cidade}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-12 flex animate-fade-up flex-col items-center justify-center gap-4 [animation-delay:calc(var(--opening)+640ms)] sm:flex-row">
        <CtaCompra className="w-full max-w-xs sm:w-auto">
          Garanta sua vaga{loteAtual ? ` · ${loteAtual.valor}` : ""}
        </CtaCompra>
        <CtaGrupo className="w-full max-w-xs sm:w-auto">Entrar no grupo gratuito</CtaGrupo>
      </div>
      {loteAtual && (
        <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.25em] text-rose/70">
          {loteAtual.nome} · Pix ou até 12x no cartão
        </p>
      )}

      <div className="mt-14 animate-fade-up [animation-delay:calc(var(--opening)+760ms)]">
        <Contagem />
      </div>
    </div>
  </section>
);
