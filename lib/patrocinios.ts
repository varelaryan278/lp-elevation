export type PedidoPatrocinio = {
  id: string;
  criadoEm: string;
  nome: string;
  empresa: string;
  whatsapp: string;
  mensagem: string;
};

export type DadosPatrocinio = Omit<PedidoPatrocinio, "id" | "criadoEm">;

export const validarPatrocinio = (entrada: unknown): DadosPatrocinio | null => {
  if (!entrada || typeof entrada !== "object" || Array.isArray(entrada)) return null;
  const dados = entrada as Record<string, unknown>;
  const campo = (nome: string) => typeof dados[nome] === "string" ? dados[nome].trim() : "";
  const nome = campo("nome");
  const empresa = campo("empresa");
  const mensagem = campo("mensagem");
  const telefone = campo("whatsapp");
  if (!/^[\d\s()+.-]+$/.test(telefone)) return null;
  const digitos = telefone.replace(/\D/g, "");
  const whatsapp = digitos.length === 10 || digitos.length === 11 ? `55${digitos}` : digitos;
  if (nome.length < 2 || nome.length > 120 || empresa.length < 2 || empresa.length > 160
    || mensagem.length < 3 || mensagem.length > 2000 || !/^55\d{10,11}$/.test(whatsapp)) return null;
  return { nome, empresa, whatsapp, mensagem };
};
