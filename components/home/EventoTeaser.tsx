import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { evento } from "@/content/evento";

export const EventoTeaser = () => (
  <Section bg="ink">
    <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
      <div>
        <Eyebrow>Próxima edição</Eyebrow>
        <p className="mt-6 font-serif text-5xl uppercase tracking-[0.2em] text-cream md:text-7xl">{evento.dataLabel}</p>
        <p className="mt-4 font-sans text-sm text-cream/70">
          {evento.local} · {evento.cidade}
        </p>
      </div>
      <Button href="/evento" variant="outline">
        Ver o evento
      </Button>
    </div>
  </Section>
);
