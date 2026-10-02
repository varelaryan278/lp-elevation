import { NextResponse } from "next/server";
import { cookieAdmin } from "@/lib/admin-auth";

export const POST = (request: Request) => {
  const headers = { "Cache-Control": "private, no-store" };
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ erro: "Origem inválida." }, { status: 403, headers });
  }
  const resposta = NextResponse.redirect(new URL("/painel/acesso/", request.url), { status: 303, headers });
  resposta.cookies.set(cookieAdmin, "", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0,
  });
  return resposta;
};
