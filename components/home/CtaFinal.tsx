import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";

export const CtaFinal = () => (
  <Section bg="ink">
    <div className="text-center">
      <h2 className="font-serif text-4xl leading-tight text-cream md:text-6xl">{marca.frases.visao}</h2>
      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button href="/evento#interesse">
          Garantir vaga
        </Button>
        <a
          href={marca.grupoWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border border-gold px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] text-gold transition-colors duration-300 hover:bg-gold hover:text-ink"
        >
          Entrar no grupo do WhatsApp
        </a>
      </div>
    </div>
  </Section>
);
