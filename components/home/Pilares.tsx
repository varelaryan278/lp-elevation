import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { marca, pilares } from "@/content/marca";

export const Pilares = () => (
  <Section bg="wine">
    <Eyebrow className="text-center">Pilares</Eyebrow>
    <ul className="mt-16 grid gap-12 md:grid-cols-3">
      {pilares.map((p) => (
        <li key={p.titulo} className="text-center">
          <h3 className="font-serif text-3xl uppercase tracking-[0.2em] text-cream">{p.titulo}</h3>
          <p className="mt-6 font-sans text-sm leading-relaxed text-cream/70">{p.texto}</p>
        </li>
      ))}
    </ul>
    <p className="mx-auto mt-20 max-w-2xl text-center font-serif text-xl italic text-gold">{marca.crescimento}</p>
  </Section>
);
