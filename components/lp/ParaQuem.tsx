import { lp } from "@/content/lp";
import { Titulo, atraso } from "./Titulo";

export const ParaQuem = () => (
  <section className="bg-bordo-deep px-5 py-24 md:py-36">
    <div className="mx-auto max-w-6xl">
      <Titulo rotulo="Para quem é">
        Para a mulher que quer <em className="text-metal not-italic">crescer inteira.</em>
      </Titulo>
      <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-bordo-line bg-bordo-line sm:grid-cols-2 lg:grid-cols-4">
        {lp.paraQuem.map((item, i) => (
          <li
            key={item.titulo}
            data-revelar
            style={atraso(i * 110)}
            className="group bg-bordo-soft p-8 transition-colors duration-500 hover:bg-[#33101a] md:p-10"
          >
            <p className="text-metal font-serif text-5xl">0{i + 1}</p>
            <h3 className="mt-8 font-serif text-2xl uppercase tracking-[0.15em] text-blush">{item.titulo}</h3>
            <p className="mt-4 font-sans text-sm leading-relaxed text-blush/65">{item.texto}</p>
            <span aria-hidden className="mt-8 block h-px w-10 bg-rose/50 transition-all duration-500 group-hover:w-20" />
          </li>
        ))}
      </ul>
    </div>
  </section>
);
