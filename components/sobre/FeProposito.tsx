import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";

export const FeProposito = () => (
  <Section bg="wine">
    <div className="grid gap-12 md:grid-cols-2 md:items-center">
      <div>
        <Eyebrow>Fé e propósito</Eyebrow>
        <h2 className="mt-6 font-serif text-4xl leading-tight text-cream md:text-5xl">{marca.frases.proposito}</h2>
      </div>
      <p className="font-sans text-base leading-relaxed text-cream/70">
        O Elevation parte de uma visão cristã de vida e propósito. A espiritualidade aparece com elegância e verdade,
        em assuntos como identidade, chamado, família, valores, coragem, serviço e legado. Um ambiente onde mulheres
        crescem profissionalmente sem separar o que fazem daquilo em que acreditam e da mulher que estão se tornando.
      </p>
    </div>
  </Section>
);
