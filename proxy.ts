import { NextResponse, type NextRequest } from "next/server";
import { adminConfigurado, autenticarAdmin, cookieAdmin } from "./lib/admin-auth";

export const proxy = (request: NextRequest) => {
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (/^\/painel\/acesso\/?$/.test(request.nextUrl.pathname)) {
    const resposta = NextResponse.next();
    for (const [nome, valor] of Object.entries(headers)) resposta.headers.set(nome, valor);
    return resposta;
  }
  if (!adminConfigurado()) {
    return new NextResponse("O acesso ao painel ainda não foi configurado.", { status: 503, headers });
  }
  if (!autenticarAdmin(request.headers.get("authorization"), request.cookies.get(cookieAdmin)?.value)) {
    if (request.headers.has("authorization")) {
      return new NextResponse("Token de acesso inválido.", {
        status: 401, headers: { ...headers, "WWW-Authenticate": 'Bearer realm="Elevation"' },
      });
    }
    const resposta = NextResponse.redirect(new URL("/painel/acesso/", request.url));
    for (const [nome, valor] of Object.entries(headers)) resposta.headers.set(nome, valor);
    return resposta;
  }
  const resposta = NextResponse.next();
  for (const [nome, valor] of Object.entries(headers)) resposta.headers.set(nome, valor);
  return resposta;
};

export const config = { matcher: ["/painel/:path*"] };
