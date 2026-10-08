import { lp } from "@/content/lp";
import { Contador } from "./Contador";
import { atraso } from "./Titulo";

export const Numeros = () => (
  <section className="border-b border-bordo-line bg-bordo-deep px-5 py-20 md:py-24">
    <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-y-14 md:grid-cols-4 md:divide-x md:divide-bordo-line">
      {lp.numeros.map((n, i) => (
        <li key={n.rotulo} data-revelar style={atraso(i * 120)} className="px-4 text-center">
          <p className="text-metal font-serif text-6xl leading-none md:text-7xl">
            <Contador valor={n.valor} sufixo={n.sufixo} />
          </p>
          <p className="mx-auto mt-4 max-w-[12rem] font-sans text-[11px] uppercase tracking-[0.3em] text-blush/60">{n.rotulo}</p>
        </li>
      ))}
    </ul>
  </section>
);
