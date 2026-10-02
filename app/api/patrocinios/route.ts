import { validarPatrocinio } from "@/lib/patrocinios";
import { redisConfigurado, salvarPatrocinio } from "@/lib/redis";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  const headers = { "Cache-Control": "no-store" };
  const origem = request.headers.get("origin");
  if (!origem || origem !== new URL(request.url).origin) {
    return Response.json({ erro: "Origem inválida." }, { status: 403, headers });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return Response.json({ erro: "Formato inválido." }, { status: 415, headers });
  }
  let entrada: unknown;
  try {
    const leitor = request.body?.getReader();
    if (!leitor) return Response.json({ erro: "Dados inválidos." }, { status: 400, headers });
    const partes: Uint8Array[] = [];
    let tamanho = 0;
    while (true) {
      const { done, value } = await leitor.read();
      if (done) break;
      tamanho += value.byteLength;
      if (tamanho > 8000) {
        await leitor.cancel();
        return Response.json({ erro: "Mensagem muito longa." }, { status: 413, headers });
      }
      partes.push(value);
    }
    entrada = JSON.parse(Buffer.concat(partes).toString("utf8"));
  } catch {
    return Response.json({ erro: "Dados inválidos." }, { status: 400, headers });
  }
  const dados = validarPatrocinio(entrada);
  if (!dados) return Response.json({ erro: "Confira o nome, a empresa, o WhatsApp com DDD e a mensagem." }, { status: 400, headers });
  if (!redisConfigurado()) {
    return Response.json({ erro: "Os pedidos estão temporariamente indisponíveis. Tente novamente mais tarde." }, { status: 503, headers });
  }
  try {
    const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for") : null;
    const salvo = await salvarPatrocinio(dados, ip);
    if (!salvo) return Response.json({ erro: "Muitos pedidos enviados. Tente novamente mais tarde." }, { status: 429, headers });
    return Response.json({ salvo: true }, { status: 201, headers });
  } catch {
    return Response.json({ erro: "Não foi possível salvar seu pedido. Tente novamente." }, { status: 503, headers });
  }
};
