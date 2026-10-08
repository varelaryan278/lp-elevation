import { marca } from "@/content/marca";
import { CtaGrupo } from "./Cta";
import { atraso } from "./Titulo";

export const Comunidade = () => (
  <section className="bg-bordo-soft px-5 py-24 md:py-32">
    <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
      <div data-revelar className="flex flex-col rounded-3xl border border-bordo-line bg-bordo-deep p-10 md:p-12">
        <p className="font-sans text-[11px] uppercase tracking-[0.35em] text-rose">Grupo gratuito</p>
        <h3 className="mt-6 font-serif text-4xl text-blush">
          Ainda não é hora? <em className="text-metal not-italic">Fique perto.</em>
        </h3>
        <p className="mt-4 flex-1 font-sans text-sm leading-relaxed text-blush/65">
          No grupo do WhatsApp você recebe novidades, encontros e as próximas edições. É gratuito e não garante vaga no evento.
        </p>
        <CtaGrupo className="mt-10 self-start">Entrar no grupo</CtaGrupo>
      </div>
      <a
        data-revelar
        style={atraso(150)}
        href={marca.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-bordo-line bg-[radial-gradient(ellipse_at_80%_0%,#5c1426,#170509_70%)] p-10 md:p-12"
      >
        <p className="font-sans text-[11px] uppercase tracking-[0.35em] text-rose">Instagram</p>
        <h3 className="mt-6 font-serif text-4xl text-blush">
          Veja os bastidores do <em className="text-metal not-italic">movimento.</em>
        </h3>
        <p className="mt-4 flex-1 font-sans text-sm leading-relaxed text-blush/65">
          Conteúdo, histórias e tudo o que acontece antes, durante e depois do Elevation.
        </p>
        <span className="mt-10 inline-flex items-center gap-3 font-sans text-xs uppercase tracking-[0.25em] text-rose-light">
          Seguir no Instagram
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </a>
    </div>
  </section>
);
