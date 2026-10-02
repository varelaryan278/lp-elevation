import { NextResponse, type NextRequest } from "next/server";
import { adminConfigurado, autenticarAdmin } from "./lib/admin-auth";

export const proxy = (request: NextRequest) => {
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (!adminConfigurado()) {
    return new NextResponse("O acesso ao painel ainda não foi configurado.", { status: 503, headers });
  }
  if (!autenticarAdmin(request.headers.get("authorization"))) {
    return new NextResponse("Acesso restrito à organização do Elevation.", {
      status: 401,
      headers: { ...headers, "WWW-Authenticate": 'Basic realm="Elevation", charset="UTF-8"' },
    });
  }
  const resposta = NextResponse.next();
  for (const [nome, valor] of Object.entries(headers)) resposta.headers.set(nome, valor);
  return resposta;
};

export const config = { matcher: ["/painel/:path*"] };
