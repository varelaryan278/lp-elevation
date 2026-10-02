import { preload } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Monograma } from "@/components/ui/Monograma";
import { marca, pilares } from "@/content/marca";

const POSTER = "/img/hero/poster.webp";

export const Hero = () => {
  preload(POSTER, { as: "image" });

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink text-center">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
        poster={POSTER}
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-linear-to-b from-ink/40 via-ink/60 to-ink" />
      <div className="relative animate-fade-up px-6 pt-20">
        <Monograma size={160} priority className="mx-auto" />
        <h1 className="mt-8 font-serif text-4xl uppercase tracking-[0.35em] text-cream sm:text-5xl md:text-7xl">
          {marca.nome}
        </h1>
        <p className="mt-4 font-serif text-xl italic text-gold md:text-2xl">{marca.assinatura}</p>
        <Eyebrow className="mt-10">{pilares.map((p) => p.titulo).join(" • ")}</Eyebrow>
        <Button href={marca.grupoWhatsapp} className="mt-12">
          Entrar no grupo
        </Button>
      </div>
    </section>
  );
};
