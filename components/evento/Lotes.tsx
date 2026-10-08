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
    <ul className="mt-12 grid gap-6 md:grid-cols-3">
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
                className="mt-8 inline-flex bg-gold px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
              >
                Garantir vaga
              </a>
            )}
          </li>
        );
      })}
    </ul>
  </Section>
);
