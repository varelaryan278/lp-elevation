import { loteAtual } from "@/content/evento";
import { CtaCompra } from "./Cta";

export const BarraCompra = () => (
  <div className="fixed inset-x-0 bottom-0 z-40 border-t border-bordo-line bg-bordo-deep/90 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="truncate font-sans text-[10px] uppercase tracking-[0.25em] text-rose">{loteAtual ? loteAtual.nome : "Ingressos"}</p>
        {loteAtual && <p className="text-metal font-serif text-2xl leading-none">{loteAtual.valor}</p>}
      </div>
      <CtaCompra className="shrink-0 px-6 py-3">Garantir vaga</CtaCompra>
    </div>
  </div>
);
