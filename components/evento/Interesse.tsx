"use client";

import type { FormEvent } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { buildMensagem, buildWhatsAppUrl } from "@/lib/whatsapp";

const origens = ["Instagram", "Indicação", "Edição anterior", "Outro"];

const campo =
  "w-full border-b border-cream/30 bg-transparent py-3 font-sans text-base text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-gold";

type Props = { numero: string; dataLabel: string };

export const Interesse = ({ numero, dataLabel }: Props) => {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const mensagem = buildMensagem(
      { nome: get("nome"), whatsapp: get("whatsapp"), cidade: get("cidade"), origem: get("origem") },
      dataLabel,
    );
    window.open(buildWhatsAppUrl(numero, mensagem), "_blank", "noopener");
  };

  return (
    <Section bg="plum" id="interesse">
      <div className="mx-auto max-w-xl">
        <Eyebrow>Garantir vaga</Eyebrow>
        <h2 className="mt-6 font-serif text-4xl text-cream">Quero estar nesse ambiente.</h2>
        <p className="mt-4 font-sans text-sm text-cream/70">
          Preencha e a gente continua a conversa no WhatsApp.
        </p>
        <form onSubmit={onSubmit} className="mt-12 grid gap-8">
          <input name="nome" placeholder="Nome" required autoComplete="name" className={campo} />
          <input name="whatsapp" type="tel" placeholder="WhatsApp com DDD" required autoComplete="tel" className={campo} />
          <input name="cidade" placeholder="Cidade" required autoComplete="address-level2" className={campo} />
          <select
            name="origem"
            required
            defaultValue=""
            aria-label="Como conheceu o Elevation?"
            className={`${campo} appearance-none`}
          >
            <option value="" disabled>
              Como conheceu o Elevation?
            </option>
            {origens.map((o) => (
              <option key={o} value={o} className="text-ink">
                {o}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="mt-4 bg-gold px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
          >
            Continuar no WhatsApp
          </button>
        </form>
      </div>
    </Section>
  );
};
