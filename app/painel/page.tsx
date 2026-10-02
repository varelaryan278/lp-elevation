import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { autenticarAdmin } from "@/lib/admin-auth";
import { listarPatrocinios, redisConfigurado } from "@/lib/redis";
import type { PedidoPatrocinio } from "@/lib/patrocinios";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Painel da organização", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const data = (valor: string) => new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo",
}).format(new Date(valor));

export default async function Painel({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  if (!autenticarAdmin((await headers()).get("authorization"))) notFound();
  const parametros = await searchParams;
  const numero = Number(parametros.pagina ?? 1);
  const pagina = Number.isSafeInteger(numero) && numero > 0 && numero <= 100000 ? numero : 1;
  let pedidos: PedidoPatrocinio[] = [];
  let total = 0;
  let erro = "";
  if (!redisConfigurado()) {
    erro = "O armazenamento dos pedidos ainda não foi configurado.";
  } else {
    try {
      ({ pedidos, total } = await listarPatrocinios(pagina));
    } catch {
      erro = "Não foi possível carregar os pedidos. Tente atualizar a página.";
    }
  }
  const paginas = Math.max(1, Math.ceil(total / 25));

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-36">
      <Eyebrow>Organização · Elevation</Eyebrow>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl text-cream md:text-5xl">Pedidos de patrocínio</h1>
          <p className="mt-4 text-sm text-cream/70">Acompanhe as empresas interessadas e continue a conversa pelo WhatsApp.</p>
        </div>
        <a href="/painel/" className="border border-gold px-6 py-3 text-sm text-gold hover:bg-gold hover:text-ink">Atualizar pedidos</a>
      </div>
      {erro ? <p role="alert" className="mt-12 border border-gold/40 p-6 text-cream">{erro}</p> : (
        <>
          <div className="mt-12 border border-gold/30 bg-plum p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cream/70">Pedidos recebidos</p>
            <p className="mt-3 font-serif text-5xl text-gold">{total}</p>
          </div>
          {total === 0 ? (
            <div className="mt-8 border border-cream/20 p-10 text-center">
              <h2 className="font-serif text-2xl">Nenhum pedido recebido ainda.</h2>
              <p className="mt-4 text-sm text-cream/60">Os pedidos enviados pelo formulário de patrocínio aparecerão aqui.</p>
            </div>
          ) : (
            <>
              <div className="mt-8 overflow-x-auto border border-cream/20">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <caption className="sr-only">Pedidos de patrocínio, do mais recente ao mais antigo</caption>
                  <thead className="bg-wine text-gold">
                    <tr>{["Recebido em", "Contato", "Empresa", "Mensagem", "WhatsApp"].map((titulo) => <th key={titulo} scope="col" className="px-5 py-4 font-normal">{titulo}</th>)}</tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id} className="border-t border-cream/15 align-top">
                        <td className="whitespace-nowrap px-5 py-5 text-cream/60">{data(pedido.criadoEm)}</td>
                        <td className="px-5 py-5">{pedido.nome}</td>
                        <td className="px-5 py-5">{pedido.empresa}</td>
                        <td className="max-w-sm whitespace-pre-wrap break-words px-5 py-5 text-cream/70">{pedido.mensagem}</td>
                        <td className="px-5 py-5">
                          <a href={buildWhatsAppUrl(pedido.whatsapp, `Olá, ${pedido.nome}! Recebemos seu interesse em patrocinar o Elevation com a ${pedido.empresa}. Vamos conversar?`)} target="_blank" rel="noopener noreferrer" className="text-gold underline">
                            +{pedido.whatsapp}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <nav aria-label="Páginas de pedidos" className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
                {pagina > 1 ? <Link href={`/painel/?pagina=${pagina - 1}`} className="text-gold underline">Anterior</Link> : <span />}
                <span className="text-cream/60">Página {pagina} de {paginas}</span>
                {pagina < paginas ? <Link href={`/painel/?pagina=${pagina + 1}`} className="text-gold underline">Próxima</Link> : <span />}
              </nav>
            </>
          )}
        </>
      )}
    </section>
  );
}
