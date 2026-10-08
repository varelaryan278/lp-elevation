import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { evento, ingressosHref } from "@/content/evento";
import { marca } from "@/content/marca";

export const CtaFinal = () => (
  <Section bg="ink">
    <div className="text-center">
      <h2 className="font-serif text-4xl leading-tight text-cream md:text-6xl">{marca.frases.visao}</h2>
    </div>
    <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
      <div className="flex flex-col border border-gold p-8 md:p-10">
        <Eyebrow>Quero ir ao evento</Eyebrow>
        <p className="mt-4 font-serif text-2xl text-cream">{evento.dataLabel} · {evento.local}</p>
        <p className="mt-4 flex-1 font-sans text-sm leading-relaxed text-cream/70">
          Garanta sua vaga na {evento.edicao}ª edição do Elevation em {evento.cidade}.
        </p>
        <Button href={ingressosHref} className="mt-8">Garantir ingresso</Button>
      </div>
      <div className="flex flex-col border border-cream/20 p-8 md:p-10">
        <Eyebrow>Quero acompanhar</Eyebrow>
        <p className="mt-4 font-serif text-2xl text-cream">Grupo gratuito</p>
        <p className="mt-4 flex-1 font-sans text-sm leading-relaxed text-cream/70">
          Receba novidades, encontros e próximas edições pelo WhatsApp. Não garante vaga no evento.
        </p>
        <Button href={marca.grupoWhatsapp} variant="outline" className="mt-8">Entrar no grupo</Button>
      </div>
    </div>
  </Section>
);
