import type { Metadata } from "next";
import { CtaFinal } from "@/components/home/CtaFinal";
import { FeProposito } from "@/components/sobre/FeProposito";
import { Historia } from "@/components/sobre/Historia";
import { Lotus } from "@/components/sobre/Lotus";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Como o Elevation nasceu, o conceito da flor de lótus e a essência de fé e propósito do movimento.",
};

const SobrePage = () => (
  <>
    <Historia />
    <Lotus />
    <FeProposito />
    <CtaFinal />
  </>
);

export default SobrePage;
