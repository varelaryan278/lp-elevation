import { Eyebrow } from "@/components/ui/Eyebrow";
import { IntentLink } from "@/components/ui/IntentLink";
import { Monograma } from "@/components/ui/Monograma";
import { marca, pilares } from "@/content/marca";

export const Footer = () => (
  <footer className="bg-ink py-16 text-cream/80">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 text-center">
      <Monograma size={56} />
      <Eyebrow>{pilares.map((p) => p.titulo).join(" • ")}</Eyebrow>
      <p className="font-serif text-xl italic text-cream">{marca.tagline}</p>
      <nav className="flex flex-wrap justify-center gap-8 font-sans text-xs uppercase tracking-[0.25em]">
        <IntentLink href="/evento#interesse" intent="participar" className="hover:text-gold">
          Garantir vaga
        </IntentLink>
        <IntentLink href="/evento#patrocinar" intent="patrocinar" className="hover:text-gold">
          Patrocinar
        </IntentLink>
        <a href={marca.instagram} target="_blank" rel="noopener" className="hover:text-gold">
          Instagram
        </a>
        <a href={`https://wa.me/${marca.whatsapp}`} target="_blank" rel="noopener" className="hover:text-gold">
          WhatsApp
        </a>
        <a href={`mailto:${marca.email}`} className="hover:text-gold">
          E-mail
        </a>
      </nav>
      <p className="font-sans text-xs text-cream/50">
        © {new Date().getFullYear()} {marca.nome}. {marca.assinatura}.
      </p>
    </div>
  </footer>
);
