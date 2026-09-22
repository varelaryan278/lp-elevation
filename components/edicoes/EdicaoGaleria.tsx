import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section, type SectionBg } from "@/components/ui/Section";
import type { Edicao } from "@/content/types";

type Props = { edicao: Edicao; bg: SectionBg; className?: string };

export const EdicaoGaleria = ({ edicao, bg, className }: Props) => (
  <Section bg={bg} className={className}>
    <Eyebrow>{edicao.data}</Eyebrow>
    <h2 className="mt-6 font-serif text-4xl md:text-6xl">{edicao.titulo}</h2>
    <p className="mt-2 font-sans text-sm opacity-70">{edicao.local}</p>
    <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed opacity-70">{edicao.descricao}</p>
    <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
      {edicao.fotos.map((foto) => (
        <li key={foto}>
          <Image src={foto} alt="" width={800} height={800} className="aspect-square w-full object-cover" />
        </li>
      ))}
    </ul>
  </Section>
);
