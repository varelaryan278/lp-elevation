import type { Metadata } from "next";
import { EdicaoGaleria } from "@/components/edicoes/EdicaoGaleria";
import { CtaFinal } from "@/components/home/CtaFinal";
import { edicoes } from "@/content/edicoes";

export const metadata: Metadata = {
  title: "Edições",
  description: "Fotos e histórias das edições do Elevation.",
};

const fundos = ["plum", "cream", "wine"] as const;

const EdicoesPage = () => (
  <>
    {edicoes.map((edicao, i) => (
      <EdicaoGaleria
        key={edicao.titulo}
        edicao={edicao}
        bg={fundos[i % fundos.length]}
        className={i === 0 ? "pt-40" : undefined}
      />
    ))}
    <CtaFinal />
  </>
);

export default EdicoesPage;
