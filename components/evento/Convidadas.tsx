import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import type { Convidada } from "@/content/types";

type Props = { convidadas: Convidada[] };

export const Convidadas = ({ convidadas }: Props) => {
  if (convidadas.length === 0) return null;

  return (
    <Section bg="wine">
      <Eyebrow>Convidadas</Eyebrow>
      <ul className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {convidadas.map((c) => (
          <li key={c.nome}>
            <Image src={c.foto} alt={c.nome} width={600} height={750} className="aspect-[4/5] w-full object-cover" />
            <h3 className="mt-6 font-serif text-2xl text-cream">{c.nome}</h3>
            <p className="mt-1 font-sans text-xs uppercase tracking-[0.25em] text-gold">{c.papel}</p>
            <p className="mt-4 font-sans text-sm text-cream/70">{c.bio}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
};
