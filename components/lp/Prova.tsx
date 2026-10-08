import Image from "next/image";
import { edicoes } from "@/content/edicoes";
import { Titulo, atraso } from "./Titulo";

const layout = ["md:row-span-2", "", "", "", "md:row-span-2", "", "hidden md:block"];

export const Prova = () => {
  const ultima = edicoes[0];
  return (
    <section className="bg-bordo-soft px-5 py-24 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Titulo rotulo={`${ultima.titulo} · ${ultima.local}`}>
          Quem esteve lá <em className="text-metal not-italic">sentiu.</em>
        </Titulo>
        <p data-revelar className="mt-6 max-w-xl font-sans text-sm leading-relaxed text-blush/65">{ultima.descricao}</p>
        <ul className="mt-14 grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-3 md:gap-4">
          {ultima.fotos.slice(0, 7).map((foto, i) => (
            <li key={foto} data-revelar="cortina" style={atraso(i * 120)} className={`group overflow-hidden rounded-2xl ${layout[i]}`}>
              <Image
                src={foto}
                alt=""
                width={800}
                height={800}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="h-full w-full object-cover saturate-[0.85] transition-transform duration-700 group-hover:scale-105"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
