import { createHash, timingSafeEqual } from "node:crypto";

export const adminConfigurado = () => Boolean(
  process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 16,
);

export const autenticarAdmin = (autorizacao: string | null) => {
  if (!adminConfigurado() || !autorizacao || !/^Basic /i.test(autorizacao)) return false;
  const credenciais = Buffer.from(autorizacao.slice(6), "base64").toString("utf8");
  const esperado = `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`;
  const hash = (valor: string) => createHash("sha256").update(valor).digest();
  return timingSafeEqual(hash(credenciais), hash(esperado));
};
