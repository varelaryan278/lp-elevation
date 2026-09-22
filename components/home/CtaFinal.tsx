import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";

export const CtaFinal = () => (
  <Section bg="ink">
    <div className="text-center">
      <h2 className="font-serif text-4xl leading-tight text-cream md:text-6xl">{marca.frases.visao}</h2>
      <Button href="/evento#interesse" className="mt-12">
        Garantir vaga
      </Button>
    </div>
  </Section>
);
