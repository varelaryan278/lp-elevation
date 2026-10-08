import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { evento, ingressosHref, loteAtual } from "@/content/evento";

export const EventoTeaser = () => (
  <Section bg="ink">
    <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
      <div>
        <Eyebrow>Próxima edição</Eyebrow>
        <p className="mt-6 font-serif text-5xl uppercase tracking-[0.2em] text-cream md:text-7xl">{evento.dataLabel}</p>
        <p className="mt-4 font-sans text-sm text-cream/70">
          {evento.horario} · {evento.local} · {evento.cidade}
        </p>
      </div>
      <div className="flex flex-col items-start gap-4 md:items-end">
        {loteAtual && (
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">
            {loteAtual.nome} · {loteAtual.valor}
          </p>
        )}
        <Button href={ingressosHref}>Garantir ingresso</Button>
        <Link href="/evento" className="font-sans text-xs uppercase tracking-[0.25em] text-cream/70 underline-offset-4 hover:text-gold hover:underline">
          Ver programação
        </Link>
      </div>
    </div>
  </Section>
);
