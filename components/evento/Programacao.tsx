import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import type { BlocoProgramacao } from "@/content/types";

type Props = { blocos: BlocoProgramacao[] };

export const Programacao = ({ blocos }: Props) => (
  <Section bg="cream">
    <Eyebrow>Programação</Eyebrow>
    <ol className="mt-12 divide-y divide-ink/10">
      {blocos.map((b) => (
        <li key={b.horario} className="grid gap-2 py-8 md:grid-cols-[8rem_1fr]">
          <span className="font-serif text-2xl text-(--accent)">{b.horario}</span>
          <div>
            <h3 className="font-serif text-2xl">{b.titulo}</h3>
            <p className="mt-2 font-sans text-sm text-ink/70">{b.descricao}</p>
          </div>
        </li>
      ))}
    </ol>
  </Section>
);
