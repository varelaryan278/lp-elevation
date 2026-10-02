import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";

export const CtaFinal = () => (
  <Section bg="ink">
    <div className="text-center">
      <h2 className="font-serif text-4xl leading-tight text-cream md:text-6xl">{marca.frases.visao}</h2>
      <p className="mx-auto mt-6 max-w-xl font-sans text-sm leading-relaxed text-cream/70">
        Entre no grupo do Elevation e acompanhe as novidades do movimento.
      </p>
      <Button href={marca.grupoWhatsapp} className="mt-12">
        Entrar no grupo do WhatsApp
      </Button>
    </div>
  </Section>
);
