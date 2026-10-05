import { createHash, randomUUID } from "node:crypto";
import type { DadosPatrocinio, PedidoPatrocinio } from "./patrocinios";

const chave = "elevation:patrocinios";

export const redisConfigurado = () => Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

export const comandoRedis = async <T>(comando: (string | number)[]): Promise<T> => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || new URL(url).protocol !== "https:") throw new Error("Redis não configurado.");
  const resposta = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(comando),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!resposta.ok) throw new Error("Não foi possível acessar o armazenamento.");
  const dados = await resposta.json() as { result: T; error?: string };
  if (dados.error || !("result" in dados)) throw new Error("Não foi possível acessar o armazenamento.");
  return dados.result;
};

const salvarScript = `
  if redis.call('GET', KEYS[2]) then return 0 end
  local quantidade = redis.call('INCR', KEYS[3])
  if quantidade == 1 then redis.call('EXPIRE', KEYS[3], 3600) end
  if quantidade > tonumber(ARGV[2]) then return -1 end
  redis.call('LPUSH', KEYS[1], ARGV[1])
  redis.call('SET', KEYS[2], '1', 'EX', 86400)
  return 1
`;

export const salvarPatrocinio = async (dados: DadosPatrocinio, ip: string | null) => {
  const dedupe = createHash("sha256").update(JSON.stringify(dados)).digest("hex");
  const origem = createHash("sha256").update(ip ?? "sem-ip").digest("hex");
  const pedido: PedidoPatrocinio = { ...dados, id: randomUUID(), criadoEm: new Date().toISOString() };
  const resultado = await comandoRedis<number>([
    "EVAL", salvarScript, 3, chave, `${chave}:duplicado:${dedupe}`, `${chave}:limite:${origem}`,
    JSON.stringify(pedido), ip ? 5 : 20,
  ]);
  return { salvo: resultado >= 0, novo: resultado === 1 };
};

export const listarPatrocinios = async (pagina: number, tamanho = 25) => {
  const inicio = (pagina - 1) * tamanho;
  const [total, registros] = await Promise.all([
    comandoRedis<number>(["LLEN", chave]),
    comandoRedis<string[]>(["LRANGE", chave, inicio, inicio + tamanho - 1]),
  ]);
  return { total, pedidos: registros.map((registro) => JSON.parse(registro) as PedidoPatrocinio) };
};
