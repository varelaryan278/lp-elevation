import { Carol } from "@/components/home/Carol";
import { CtaFinal } from "@/components/home/CtaFinal";
import { EventoTeaser } from "@/components/home/EventoTeaser";
import { Galeria } from "@/components/home/Galeria";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Pilares } from "@/components/home/Pilares";

const Home = () => (
  <>
    <Hero />
    <Manifesto />
    <Pilares />
    <EventoTeaser />
    <Carol />
    <Galeria />
    <CtaFinal />
  </>
);

export default Home;
