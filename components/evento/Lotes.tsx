import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import type { Lote, LoteStatus } from "@/content/types";

const rotulo: Record<LoteStatus, string> = {
  disponivel: "Disponível",
  esgotado: "Esgotado",
  "em-breve": "Em breve",
};

type Props = { lotes: Lote[] };

export const Lotes = ({ lotes }: Props) => (
  <Section bg="ink" id="ingressos">
    <Eyebrow>Ingressos</Eyebrow>
    <h2 className="mt-6 font-serif text-4xl text-cream md:text-5xl">Garanta sua vaga.</h2>
    <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-cream/70">
      O valor sobe a cada lote. Compra segura pela Kiwify, no Pix ou no cartão em até 12x.
    </p>
    <ul className="mt-12 grid gap-6 lg:grid-cols-3">
      {lotes.map((l) => {
        const ativo = l.status === "disponivel";
        return (
          <li key={l.nome} className={`border p-8 ${ativo ? "border-gold" : "border-cream/20"}`}>
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">{l.nome}</p>
            <p className={`mt-4 font-serif text-4xl ${ativo ? "text-cream" : "text-cream/50"}`}>{l.valor}</p>
            <p className="mt-6 font-sans text-xs uppercase tracking-[0.25em] text-cream/80">{rotulo[l.status]}</p>
            {ativo && (
              <a
                href={l.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full justify-center whitespace-nowrap sm:inline-flex sm:w-auto lg:flex lg:w-full bg-gold px-6 py-4 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
              >
                Garantir ingresso
              </a>
            )}
          </li>
        );
      })}
    </ul>
  </Section>
);
