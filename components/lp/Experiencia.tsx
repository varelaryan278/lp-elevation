import Image from "next/image";
import { lp } from "@/content/lp";
import { Titulo, atraso } from "./Titulo";

export const Experiencia = () => (
  <section id="experiencia" className="scroll-mt-28 overflow-hidden bg-bordo-deep px-5 py-24 md:py-36">
    <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
      <div>
        <Titulo rotulo="A experiência">
          Muito além de <em className="text-metal not-italic">palestras.</em>
        </Titulo>
        <ul className="mt-12 space-y-8">
          {lp.experiencia.map((item, i) => (
            <li key={item.titulo} data-revelar="esquerda" style={atraso(i * 140)} className="flex gap-6 border-b border-bordo-line pb-8 last:border-0">
              <span className="text-metal font-serif text-2xl">✦</span>
              <div>
                <h3 className="font-serif text-2xl text-blush">{item.titulo}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-blush/65">{item.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div data-revelar="direita" style={atraso(200)} className="relative">
        <div aria-hidden className="halo absolute -inset-8 rounded-[3rem] bg-bordo/60 blur-3xl" />
        <div className="borda-metal relative overflow-hidden rounded-[2.5rem] p-2">
          <Image
            src="/img/lp/kit.webp"
            alt="Identidade visual do Elevation aplicada em camiseta, ecobag, copos, caderno e crachá"
            width={1400}
            height={1400}
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="aspect-square w-full rounded-[2.1rem] object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);
