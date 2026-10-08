import { lp } from "@/content/lp";

const itens = [...lp.temas, ...lp.pilares];

export const Faixa = () => (
  <div aria-hidden className="overflow-hidden border-y border-bordo-line bg-bordo py-5">
    <div className="faixa flex w-max">
      {[0, 1].map((copia) => (
        <ul key={copia} className="flex shrink-0 items-center">
          {itens.map((item) => (
            <li key={item} className="flex items-center gap-8 pr-8 font-serif text-2xl uppercase tracking-[0.2em] text-blush/80 sm:text-3xl">
              {item}
              <span className="text-metal text-lg">✦</span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  </div>
);
