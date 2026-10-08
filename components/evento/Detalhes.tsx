import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { ingressosHref } from "@/content/evento";
import type { Lote, Evento } from "@/content/types";

type Props = { evento: Evento; loteAtual?: Lote };

export const Detalhes = ({ evento, loteAtual }: Props) => (
  <Section bg="ink" className="pt-40">
    <Eyebrow>{evento.edicao}ª edição</Eyebrow>
    <h1 className="mt-6 font-serif text-5xl uppercase tracking-[0.2em] text-cream md:text-7xl">
      {evento.dataLabel}
    </h1>
    <dl className="mt-12 grid gap-8 font-sans text-sm md:grid-cols-3">
      <div>
        <dt className="text-xs uppercase tracking-[0.25em] text-gold">Horário</dt>
        <dd className="mt-2 text-lg">{evento.horario}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.25em] text-gold">Local</dt>
        <dd className="mt-2 text-lg">{evento.local}</dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-[0.25em] text-gold">Endereço</dt>
        <dd className="mt-2 text-lg">
          {evento.endereco}, {evento.cidade}
          <br />
          <a href={evento.mapaUrl} target="_blank" rel="noopener" className="text-gold underline-offset-4 hover:underline">
            Ver no mapa
          </a>
        </dd>
      </div>
    </dl>
    <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
      <Button href={ingressosHref}>Garantir ingresso</Button>
      {loteAtual ? (
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-cream/70">
          {loteAtual.nome} por {loteAtual.valor}
        </p>
      ) : (
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-cream/70">Confira a disponibilidade dos lotes</p>
      )}
    </div>
  </Section>
);
