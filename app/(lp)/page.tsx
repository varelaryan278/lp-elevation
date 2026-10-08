import type { Metadata } from "next";
import { BarraCompra } from "@/components/lp/BarraCompra";
import { Comunidade } from "@/components/lp/Comunidade";
import { Convidadas } from "@/components/lp/Convidadas";
import { Cortina } from "@/components/lp/Cortina";
import { Duvidas } from "@/components/lp/Duvidas";
import { Experiencia } from "@/components/lp/Experiencia";
import { Faixa } from "@/components/lp/Faixa";
import { Fechamento } from "@/components/lp/Fechamento";
import { Hero } from "@/components/lp/Hero";
import { Ingressos } from "@/components/lp/Ingressos";
import { Manifesto } from "@/components/lp/Manifesto";
import { Numeros } from "@/components/lp/Numeros";
import { ParaQuem } from "@/components/lp/ParaQuem";
import { Programacao } from "@/components/lp/Programacao";
import { Prova } from "@/components/lp/Prova";
import { Revelar } from "@/components/lp/Revelar";
import { Rodape } from "@/components/lp/Rodape";
import { Topo } from "@/components/lp/Topo";
import { evento } from "@/content/evento";
import { lp } from "@/content/lp";

export const metadata: Metadata = {
  title: { absolute: `Elevation · ${evento.dataLabel} em ${evento.cidade}` },
  description: `${lp.titulo.antes} ${lp.titulo.destaque.toLowerCase()} ${lp.titulo.depois}. ${lp.subtitulo}`,
  robots: { index: false, follow: false },
};

const NovoPage = () => (
  <div className="bg-bordo-deep text-blush">
    <Cortina />
    <Topo />
    <main>
      <Revelar>
        <Hero />
        <Faixa />
        <Numeros />
        <Manifesto />
        <ParaQuem />
        <Convidadas />
        <Programacao />
        <Experiencia />
        <Prova />
        <Ingressos />
        <Comunidade />
        <Duvidas />
        <Fechamento />
      </Revelar>
    </main>
    <Rodape />
    <BarraCompra />
  </div>
);

export default NovoPage;
