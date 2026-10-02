import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const cookieAdmin = "elevation_admin";
export const duracaoSessaoAdmin = 8 * 60 * 60;

export const adminConfigurado = () => Boolean(
  process.env.ADMIN_TOKEN && process.env.ADMIN_TOKEN.length >= 32,
);

const comparar = (recebido: string, esperado: string) => {
  const hash = (valor: string) => createHash("sha256").update(valor).digest();
  return timingSafeEqual(hash(recebido), hash(esperado));
};

export const validarTokenAdmin = (token: string) =>
  adminConfigurado() && comparar(token, process.env.ADMIN_TOKEN!);

const assinar = (conteudo: string) =>
  createHmac("sha256", process.env.ADMIN_TOKEN!).update(`elevation-admin:${conteudo}`).digest("hex");

export const criarSessaoAdmin = () => {
  if (!adminConfigurado()) throw new Error("Acesso administrativo não configurado.");
  const expiracao = Math.floor(Date.now() / 1000) + duracaoSessaoAdmin;
  const conteudo = `${expiracao}.${randomBytes(16).toString("hex")}`;
  return `${conteudo}.${assinar(conteudo)}`;
};

export const validarSessaoAdmin = (sessao?: string) => {
  if (!adminConfigurado() || !sessao) return false;
  const partes = /^(\d{10})\.([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(sessao);
  if (!partes) return false;
  const expiracao = Number(partes[1]);
  const agora = Math.floor(Date.now() / 1000);
  if (expiracao <= agora || expiracao > agora + duracaoSessaoAdmin) return false;
  return comparar(partes[3], assinar(`${partes[1]}.${partes[2]}`));
};

export const autenticarAdmin = (autorizacao: string | null, sessao?: string) => {
  const bearer = autorizacao ? /^Bearer (\S+)$/i.exec(autorizacao) : null;
  return (bearer ? validarTokenAdmin(bearer[1]) : false) || validarSessaoAdmin(sessao);
};
