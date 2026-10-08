import { lp } from "@/content/lp";
import { Titulo } from "./Titulo";

export const Duvidas = () => (
  <section id="duvidas" className="scroll-mt-28 bg-bordo-deep px-5 py-24 md:py-36">
    <div className="mx-auto max-w-3xl">
      <Titulo rotulo="Dúvidas" centro>
        Antes de <em className="text-metal not-italic">garantir.</em>
      </Titulo>
      <div className="mt-14 divide-y divide-bordo-line border-y border-bordo-line">
        {lp.faq.map((item) => (
          <details key={item.pergunta} className="group py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-2xl text-blush [&::-webkit-details-marker]:hidden">
              {item.pergunta}
              <span aria-hidden className="text-rose transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 font-sans text-sm leading-relaxed text-blush/65">{item.resposta}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);
