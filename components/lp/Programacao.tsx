import { evento } from "@/content/evento";
import { Titulo, atraso } from "./Titulo";

export const Programacao = () => (
  <section className="bg-bordo-soft px-5 py-24 md:py-36">
    <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_1.4fr]">
      <div className="lg:sticky lg:top-40 lg:self-start">
        <Titulo rotulo="Programação">
          Uma tarde, <em className="text-metal not-italic">cinco momentos.</em>
        </Titulo>
        <p data-revelar className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-blush/65">
          Do café de boas-vindas ao último brinde, cada bloco foi pensado para você sair com conteúdo e com conexões.
        </p>
      </div>
      <ol data-revelar className="relative">
        <span aria-hidden className="cresce absolute top-0 bottom-0 left-0 w-px bg-linear-to-b from-rose/70 via-rose/30 to-transparent" />
        {evento.programacao.map((bloco, i) => (
          <li key={bloco.horario} data-revelar="direita" style={atraso(300 + i * 160)} className="relative pb-12 pl-10 last:pb-0">
            <span aria-hidden className="bg-metal absolute top-2 -left-[4px] h-[9px] w-[9px] rounded-full ring-4 ring-bordo-soft" />
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-rose">{bloco.horario}</p>
            <h3 className="mt-2 font-serif text-3xl text-blush">{bloco.titulo}</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-blush/60">{bloco.descricao}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
