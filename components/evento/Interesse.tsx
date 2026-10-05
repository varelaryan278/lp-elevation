"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { marca } from "@/content/marca";
import { getIntent, getServerIntent, setIntent, subscribeIntent } from "@/lib/intent";
import { trackSponsorInterest, trackSponsorLead } from "@/lib/meta-pixel";

const campo =
  "w-full border-b border-cream/30 bg-transparent py-3 font-sans text-base text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-gold";

const aba = (ativo: boolean) =>
  `px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] transition-colors ${
    ativo ? "bg-gold text-ink" : "border border-cream/30 text-cream/80 hover:border-gold hover:text-gold"
  }`;

export const Interesse = () => {
  const modo = useSyncExternalStore(subscribeIntent, getIntent, getServerIntent);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const textos = marca.interesse[modo];

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (enviando) return;
    const formulario = event.currentTarget;
    const dados = new FormData(formulario);
    setEnviando(true);
    setErro("");
    try {
      const resposta = await fetch("/api/patrocinios/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(dados)),
      });
      const resultado = await resposta.json() as { salvo?: boolean; erro?: string };
      if (!resposta.ok || !resultado.salvo) throw new Error(resultado.erro ?? "Não foi possível enviar seu pedido.");
      formulario.reset();
      setEnviado(true);
      trackSponsorLead();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível enviar seu pedido. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Section bg="plum" id="interesse">
      <div id="patrocinar" className="scroll-mt-40" />
      <div className="mx-auto max-w-xl">
        <div className="flex flex-wrap gap-3">
          <a href={marca.grupoWhatsapp} target="_blank" rel="noopener noreferrer" className={aba(modo === "participar")}>
            Entrar no grupo
          </a>
          <button type="button" className={aba(modo === "patrocinar")} onClick={() => {
            setIntent("patrocinar");
            trackSponsorInterest();
          }}>
            Quero patrocinar
          </button>
        </div>
        <Eyebrow className="mt-12">{textos.eyebrow}</Eyebrow>
        <h2 className="mt-6 font-serif text-4xl text-cream">{textos.titulo}</h2>
        <p className="mt-4 font-sans text-sm leading-relaxed text-cream/70">{textos.texto}</p>
        {modo === "participar" ? (
          <Button href={marca.grupoWhatsapp} className="mt-12">Entrar no grupo do WhatsApp</Button>
        ) : enviado ? (
          <div role="status" className="mt-12 border border-gold/40 p-8">
            <p className="font-serif text-2xl text-cream">Recebemos seu pedido de patrocínio.</p>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              A organização entrará em contato pelo WhatsApp que você informou.
            </p>
            <button type="button" onClick={() => setEnviado(false)} className="mt-6 text-sm text-gold underline">
              Enviar outro pedido
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-12 grid gap-8">
            <label className="text-sm text-cream/80">
              Nome
              <input name="nome" placeholder="Seu nome" required minLength={2} maxLength={120} autoComplete="name" className={campo} />
            </label>
            <label className="text-sm text-cream/80">
              Empresa
              <input name="empresa" placeholder="Nome da empresa" required minLength={2} maxLength={160} autoComplete="organization" className={campo} />
            </label>
            <label className="text-sm text-cream/80">
              WhatsApp com DDD
              <input name="whatsapp" type="tel" placeholder="(43) 99999-0000" required maxLength={24} autoComplete="tel" className={campo} />
            </label>
            <label className="text-sm text-cream/80">
              Mensagem
              <textarea name="mensagem" placeholder="Conte como sua empresa gostaria de participar" rows={3} required minLength={3} maxLength={2000} className={`${campo} resize-none`} />
            </label>
            <p className="text-xs leading-relaxed text-cream/60">
              Ao enviar, você autoriza a organização do Elevation a usar estes dados para responder ao seu pedido de patrocínio.
            </p>
            {erro && <p role="alert" className="text-sm text-cream">{erro}</p>}
            <button type="submit" disabled={enviando} className="mt-4 bg-gold px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light disabled:cursor-wait disabled:opacity-60">
              {enviando ? "Enviando…" : "Enviar pedido de patrocínio"}
            </button>
          </form>
        )}
      </div>
    </Section>
  );
};
