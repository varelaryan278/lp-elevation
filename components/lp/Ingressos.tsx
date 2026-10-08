import { evento, loteAtual } from "@/content/evento";
import type { LoteStatus } from "@/content/types";
import { CtaCompra } from "./Cta";
import { Titulo, atraso } from "./Titulo";

const rotulo: Record<LoteStatus, string> = { disponivel: "À venda agora", esgotado: "Esgotado", "em-breve": "Próximo lote" };

export const Ingressos = () => (
  <section id="ingressos" className="relative isolate scroll-mt-28 overflow-hidden bg-bordo-deep px-5 py-24 md:py-36">
    <div aria-hidden className="halo absolute top-1/3 left-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-bordo/60 blur-[120px]" />
    <div className="mx-auto max-w-6xl">
      <Titulo rotulo="Ingressos" centro>
        Garanta sua vaga <em className="text-metal not-italic">antes da virada.</em>
      </Titulo>
      <p data-revelar className="mx-auto mt-6 max-w-lg text-center font-sans text-sm leading-relaxed text-blush/65">
        O valor sobe a cada lote. Compra segura pela Kiwify, no Pix ou no cartão em até 12x.
      </p>
      <ul className="mt-16 grid items-center gap-6 lg:grid-cols-3">
        {evento.lotes.map((lote, i) => {
          const ativo = lote === loteAtual;
          return (
            <li
              key={lote.nome}
              data-revelar
              style={atraso(i * 120)}
              className={`relative rounded-3xl p-8 text-center md:p-10 ${
                ativo ? "borda-metal lg:scale-105" : "border border-bordo-line bg-bordo-soft/60"
              }`}
            >
              {ativo && (
                <span className="bg-metal absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 font-sans text-[10px] font-medium whitespace-nowrap uppercase tracking-[0.25em] text-bordo-deep">
                  Melhor preço
                </span>
              )}
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-rose">{lote.nome}</p>
              <p className={`mt-6 font-serif text-6xl ${ativo ? "text-metal" : "text-blush/35"}`}>{lote.valor}</p>
              <p className={`mt-4 font-sans text-[11px] uppercase tracking-[0.3em] ${ativo ? "text-blush" : "text-blush/40"}`}>{rotulo[lote.status]}</p>
              {ativo ? (
                <CtaCompra className="mt-10 w-full">Garantir minha vaga</CtaCompra>
              ) : (
                <p className="mt-10 rounded-full border border-bordo-line py-4 font-sans text-[11px] uppercase tracking-[0.25em] text-blush/35">
                  {lote.status === "esgotado" ? "Encerrado" : "Em breve"}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p data-revelar className="mt-10 text-center font-sans text-[11px] uppercase tracking-[0.25em] text-blush/45">
        O titular do ingresso não pode ser alterado após a compra
      </p>
    </div>
  </section>
);
