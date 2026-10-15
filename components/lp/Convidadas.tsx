import Image from "next/image";
import { especial, lp, type ConvidadaLp } from "@/content/lp";
import { Anfitria } from "./Anfitria";
import { Destaque } from "./Destaque";
import { Titulo, atraso } from "./Titulo";

const Retrato = ({ pessoa }: { pessoa: ConvidadaLp }) => (
  <div className="borda-metal relative aspect-[4/5] overflow-hidden rounded-t-full p-2">
    <div className="relative h-full w-full overflow-hidden rounded-t-full bg-[radial-gradient(ellipse_at_50%_30%,#5c1426,#1e060b_75%)]">
      {pessoa.foto ? (
        <Image src={pessoa.foto} alt={`${pessoa.nome} ${pessoa.sobrenome}`} fill sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 85vw" className="object-cover object-top grayscale-[0.15] transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <span className="text-metal font-serif text-8xl">{pessoa.sobrenome[0]}</span>
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-rose/50">Foto em breve</span>
        </div>
      )}
    </div>
  </div>
);

export const Convidadas = () => (
  <section id="convidadas" className="scroll-mt-28 bg-bordo-deep px-5 py-24 md:py-36">
    <div className="mx-auto max-w-6xl">
      <Titulo rotulo="Quem sobe ao palco" centro>
        Mulheres que <em className="text-metal not-italic">vivem</em> o que falam.
      </Titulo>
      {lp.convidadas.filter(especial).map((c) => (
        <Destaque key={c.sobrenome} pessoa={c} />
      ))}
      <ul className="mx-auto mt-28 flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-16">
        {lp.convidadas.filter((c) => !especial(c)).map((c, i) => (
          <li key={c.sobrenome} data-revelar="escala" style={atraso((i % 4) * 160)} className="group w-full max-w-xs text-center sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
            <Retrato pessoa={c} />
            <p className="mt-8 font-sans text-xs uppercase tracking-[0.3em] text-rose">{c.nome}</p>
            <p className="mt-1 font-serif text-4xl uppercase tracking-[0.1em] text-blush lg:text-3xl">{c.sobrenome}</p>
            <span aria-hidden className="mx-auto mt-4 block h-px w-10 bg-rose/50" />
            <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.3em] text-blush/60">{c.papel ?? "Palestrante convidada"}</p>
          </li>
        ))}
      </ul>
      <div className="mt-28 grid gap-10">
        {lp.anfitrias.map((a, i) => (
          <Anfitria key={a.sobrenome} pessoa={a} invertido={i % 2 === 1} />
        ))}
      </div>
    </div>
  </section>
);
