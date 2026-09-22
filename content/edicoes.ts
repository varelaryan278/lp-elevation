import type { Edicao } from "./types";

const fotos = Array.from({ length: 10 }, (_, i) => `/img/edicoes/1/${String(i + 1).padStart(2, "0")}.webp`);

export const edicoes: Edicao[] = [
  {
    titulo: "1ª edição",
    local: "Decol Design, Londrina",
    data: "2025",
    descricao:
      "Um formato intimista: café, histórias reais, entrevistas e conexões entre mulheres, influenciadoras e empreendedoras. Foi ali que ficou claro que o Elevation podia ser maior do que um encontro.",
    fotos,
  },
];
