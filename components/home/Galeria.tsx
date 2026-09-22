import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { edicoes } from "@/content/edicoes";

export const Galeria = () => {
  const ultima = edicoes[0];

  return (
    <Section bg="plum">
      <Eyebrow>{ultima.titulo}</Eyebrow>
      <h2 className="mt-6 font-serif text-4xl text-cream">{ultima.local}</h2>
      <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
        {ultima.fotos.slice(0, 6).map((foto) => (
          <li key={foto}>
            <Image src={foto} alt="" width={800} height={800} className="aspect-square w-full object-cover" />
          </li>
        ))}
      </ul>
      <Button href="/edicoes" variant="outline" className="mt-12">
        Ver edições
      </Button>
    </Section>
  );
};
