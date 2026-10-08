import type { Metadata } from "next";
import { Convidadas } from "@/components/evento/Convidadas";
import { Detalhes } from "@/components/evento/Detalhes";
import { Interesse } from "@/components/evento/Interesse";
import { Lotes } from "@/components/evento/Lotes";
import { Programacao } from "@/components/evento/Programacao";
import { convidadas } from "@/content/convidadas";
import { evento } from "@/content/evento";
import { marca } from "@/content/marca";

export const metadata: Metadata = {
  title: `Evento ${evento.dataLabel}`,
  description: `${evento.edicao}ª edição do Elevation em ${evento.cidade}. ${marca.tagline}`,
};

const EventoPage = () => (
  <>
    <Detalhes evento={evento} />
    <Programacao blocos={evento.programacao} />
    <Convidadas convidadas={convidadas} />
    <Lotes lotes={evento.lotes} />
    <Interesse />
  </>
);

export default EventoPage;
