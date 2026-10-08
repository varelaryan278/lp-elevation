import type { Edicao } from "./types";

const fotos = ["01", "02", "03", "04", "05", "06", "08", "09"].map((n) => `/img/edicoes/1/${n}.webp`);

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
