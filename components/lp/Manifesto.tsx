import Image from "next/image";
import { lp } from "@/content/lp";

export const Manifesto = () => (
  <section className="relative isolate overflow-hidden bg-bordo-deep px-5 py-28 md:py-40">
    <div aria-hidden className="absolute -inset-y-24 inset-x-0 -z-10">
      <Image src="/img/lp/textura-vinho.webp" alt="" fill sizes="100vw" className="paralaxe object-cover opacity-45" />
    </div>
    <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-bordo-deep via-bordo-deep/40 to-bordo-deep" />
    <p data-revelar className="mx-auto max-w-4xl text-center font-serif text-4xl leading-tight text-blush italic sm:text-5xl md:text-6xl">
      {lp.manifesto.split(". ").map((frase, i, todas) => (
        <span key={frase} className={i === todas.length - 1 ? "text-metal block not-italic" : "block"}>
          {i < todas.length - 1 ? `${frase}.` : frase}
        </span>
      ))}
    </p>
  </section>
);
