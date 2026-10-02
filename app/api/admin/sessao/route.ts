import { NextResponse } from "next/server";
import { adminConfigurado, cookieAdmin, criarSessaoAdmin, duracaoSessaoAdmin, validarTokenAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  const headers = { "Cache-Control": "private, no-store" };
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ erro: "Origem inválida." }, { status: 403, headers });
  }
  if (!adminConfigurado()) return Response.json({ erro: "Acesso ainda não configurado." }, { status: 503, headers });
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) {
    return Response.json({ erro: "Formato inválido." }, { status: 415, headers });
  }
  if (Number(request.headers.get("content-length")) > 4096) {
    return Response.json({ erro: "Dados inválidos." }, { status: 413, headers });
  }
  const corpo = await request.text();
  if (corpo.length > 4096) return Response.json({ erro: "Dados inválidos." }, { status: 413, headers });
  const token = new URLSearchParams(corpo).get("token") ?? "";
  if (!validarTokenAdmin(token)) {
    return NextResponse.redirect(new URL("/painel/acesso/?erro=token", request.url), { status: 303, headers });
  }
  const resposta = NextResponse.redirect(new URL("/painel/", request.url), { status: 303, headers });
  resposta.cookies.set(cookieAdmin, criarSessaoAdmin(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: duracaoSessaoAdmin,
  });
  return resposta;
};
