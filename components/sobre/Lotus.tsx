import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";

export const Lotus = () => (
  <Section bg="cream">
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow>A flor de lótus</Eyebrow>
      <p className="mt-10 font-sans text-base leading-relaxed text-ink/70">
        Mulheres que nem sempre começaram em circunstâncias fáceis, mas que atravessaram processos, dores e decisões e,
        ainda assim, floresceram. Não é sobre romantizar o sofrimento. É sobre saber que uma trajetória difícil não
        determina onde uma mulher precisa terminar.
      </p>
      <ul className="mt-16 space-y-8">
        {marca.frases.lotus.map((f) => (
          <li key={f} className="font-serif text-2xl italic text-wine md:text-3xl">
            {f}
          </li>
        ))}
      </ul>
    </div>
  </Section>
);
