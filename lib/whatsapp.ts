export type Interesse = { nome: string; whatsapp: string; cidade: string; origem: string };

export const buildMensagem = (i: Interesse, dataLabel: string) =>
  `Olá! Quero garantir minha vaga no Elevation ${dataLabel}. Nome: ${i.nome} | WhatsApp: ${i.whatsapp} | Cidade: ${i.cidade} | Conheci por: ${i.origem}`;

export const buildWhatsAppUrl = (numero: string, mensagem: string) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
