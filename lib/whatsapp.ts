export type Patrocinio = { nome: string; empresa: string; whatsapp: string; mensagem: string };

export const buildMensagemPatrocinio = (p: Patrocinio, dataLabel: string) =>
  `Olá! Tenho interesse em patrocinar o Elevation ${dataLabel}. Nome: ${p.nome} | Empresa: ${p.empresa} | WhatsApp: ${p.whatsapp} | Mensagem: ${p.mensagem}`;

export const buildWhatsAppUrl = (numero: string, mensagem: string) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
