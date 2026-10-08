import type { Metadata } from "next";
import { adminConfigurado } from "@/lib/admin-auth";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = { title: "Acesso ao painel", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AcessoPainel({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  const configurado = adminConfigurado();
  return (
    <section className="mx-auto max-w-xl px-6 pb-24 pt-36">
      <Eyebrow>Organização · Elevation</Eyebrow>
      <h1 className="mt-6 font-serif text-4xl text-cream">Acessar painel</h1>
      <p className="mt-4 text-sm text-cream/70">Informe seu token de acesso da organização.</p>
      {!configurado ? <p role="alert" className="mt-8 text-sm text-cream">O acesso ao painel ainda não foi configurado.</p> : (
        <form action="/api/admin/sessao/" method="post" className="mt-10 grid gap-6">
          <label className="text-sm text-cream/80">
            Token de acesso
            <input name="token" type="password" required minLength={32} maxLength={512} autoComplete="off" spellCheck={false} className="mt-3 w-full border-b border-cream/30 bg-transparent py-3 text-cream outline-none focus:border-gold" />
          </label>
          {erro && <p role="alert" className="text-sm text-cream">Token inválido. Confira e tente novamente.</p>}
          <button type="submit" className="bg-gold px-8 py-4 text-xs uppercase tracking-[0.25em] text-ink hover:bg-gold-light">Entrar no painel</button>
        </form>
      )}
    </section>
  );
}
