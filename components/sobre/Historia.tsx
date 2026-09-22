import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { edicoes } from "@/content/edicoes";
import { marca } from "@/content/marca";

export const Historia = () => (
  <Section bg="ink" className="pt-40">
    <Eyebrow>Sobre</Eyebrow>
    <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight text-cream md:text-6xl">{marca.frases.virada}</h1>
    <div className="mt-16 grid gap-12 font-sans text-base leading-relaxed text-cream/70 md:grid-cols-2">
      <p>
        O Elevation nasceu do desejo de criar um ambiente feminino diferente dos eventos tradicionais. Não um lugar
        onde algumas pessoas sobem ao palco, contam histórias e o público vai embora. Um lugar de conexão verdadeira,
        troca de experiências e histórias reais.
      </p>
      <p>
        A primeira edição, na {edicoes[0].local}, teve formato intimista: café, entrevistas, conversas e networking.
        Foi ali que ficou claro que o Elevation podia ser maior do que um encontro. De um encontro feminino, virou um
        movimento de crescimento e conexão.
      </p>
    </div>
  </Section>
);
