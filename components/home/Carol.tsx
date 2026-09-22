import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { carol } from "@/content/carol";

export const Carol = () => (
  <Section bg="cream">
    <div className="grid items-center gap-12 md:grid-cols-2">
      <Image src={carol.foto} alt={carol.nome} width={900} height={1125} className="aspect-[4/5] w-full object-cover" />
      <div>
        <Eyebrow>{carol.papel}</Eyebrow>
        <h2 className="mt-6 font-serif text-4xl md:text-5xl">{carol.nome}</h2>
        <p className="mt-8 font-sans text-base leading-relaxed text-ink/70">{carol.bio}</p>
      </div>
    </div>
  </Section>
);
