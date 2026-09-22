import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";

export const Manifesto = () => (
  <Section bg="cream">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="font-serif text-4xl leading-tight md:text-6xl">{marca.tagline}</h2>
      <p className="mt-10 font-sans text-base leading-relaxed text-ink/70 md:text-lg">{marca.essencia}</p>
    </div>
  </Section>
);
