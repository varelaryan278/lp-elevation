"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";
import { buildMensagem, buildMensagemPatrocinio, buildWhatsAppUrl } from "@/lib/whatsapp";

type Modo = "participar" | "patrocinar";

const origens = ["Instagram", "Indicação", "Edição anterior", "Outro"];

const campo =
  "w-full border-b border-cream/30 bg-transparent py-3 font-sans text-base text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-gold";

const aba = (ativo: boolean) =>
  `px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] transition-colors ${
    ativo ? "bg-gold text-ink" : "border border-cream/30 text-cream/80 hover:border-gold hover:text-gold"
  }`;

const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

const useHash = () =>
  useSyncExternalStore(
    subscribeHash,
    () => window.location.hash,
    () => "",
  );

type Props = { numero: string; dataLabel: string };

export const Interesse = ({ numero, dataLabel }: Props) => {
  const hash = useHash();
  const [escolha, setEscolha] = useState<{ hash: string; modo: Modo } | null>(null);
  const modo: Modo = escolha?.hash === hash ? escolha.modo : hash === "#patrocinar" ? "patrocinar" : "participar";
  const textos = marca.interesse[modo];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const mensagem =
      modo === "patrocinar"
        ? buildMensagemPatrocinio(
            { nome: get("nome"), empresa: get("empresa"), whatsapp: get("whatsapp"), mensagem: get("mensagem") },
            dataLabel,
          )
        : buildMensagem(
            { nome: get("nome"), whatsapp: get("whatsapp"), cidade: get("cidade"), origem: get("origem") },
            dataLabel,
          );
    window.open(buildWhatsAppUrl(numero, mensagem), "_blank", "noopener");
  };

  return (
    <Section bg="plum" id="interesse">
      <div id="patrocinar" className="scroll-mt-40" />
      <div className="mx-auto max-w-xl">
        <div className="flex gap-3">
          <button type="button" className={aba(modo === "participar")} onClick={() => setEscolha({ hash, modo: "participar" })}>
            Quero participar
          </button>
          <button type="button" className={aba(modo === "patrocinar")} onClick={() => setEscolha({ hash, modo: "patrocinar" })}>
            Quero patrocinar
          </button>
        </div>
        <Eyebrow className="mt-12">{textos.eyebrow}</Eyebrow>
        <h2 className="mt-6 font-serif text-4xl text-cream">{textos.titulo}</h2>
        <p className="mt-4 font-sans text-sm text-cream/70">{textos.texto}</p>
        <form key={modo} onSubmit={onSubmit} className="mt-12 grid gap-8">
          <input name="nome" placeholder="Nome" required autoComplete="name" className={campo} />
          {modo === "patrocinar" && (
            <input name="empresa" placeholder="Empresa" required autoComplete="organization" className={campo} />
          )}
          <input name="whatsapp" type="tel" placeholder="WhatsApp com DDD" required autoComplete="tel" className={campo} />
          {modo === "participar" ? (
            <>
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
            </>
          ) : (
            <textarea name="mensagem" placeholder="Mensagem" rows={3} required className={`${campo} resize-none`} />
          )}
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
