import type { Evento } from "./types";

export const evento: Evento = {
  edicao: 2,
  dataIso: "2026-10-12",
  dataLabel: "12 de outubro",
  horario: "14h às 19h",
  local: "Local a confirmar",
  endereco: "Endereço a confirmar",
  cidade: "Londrina, PR",
  mapaUrl: "https://maps.google.com/?q=Londrina+PR",
  programacao: [
    { horario: "14h", titulo: "Credenciamento e café", descricao: "Recepção, ambientação e primeiras conexões." },
    { horario: "15h", titulo: "Abertura", descricao: "Carol Oliveira apresenta a visão por trás do movimento." },
    { horario: "15h30", titulo: "Histórias que elevam", descricao: "Entrevistas com convidadas sobre bastidores do crescimento." },
    { horario: "17h", titulo: "Networking guiado", descricao: "Dinâmica para que as mulheres realmente se conheçam." },
    { horario: "18h", titulo: "Encerramento", descricao: "Momento de conexão, fotos e despedida." },
  ],
  lotes: [
    { nome: "1º lote", valor: "R$ 197", status: "disponivel" },
    { nome: "2º lote", valor: "R$ 247", status: "em-breve" },
  ],
};
