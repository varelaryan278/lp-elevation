import Link from "next/link";
import { IntentLink } from "@/components/ui/IntentLink";
import { Monograma } from "@/components/ui/Monograma";
import { ingressosHref } from "@/content/evento";
import { marca, nav } from "@/content/marca";
import { MobileMenu } from "./MobileMenu";

const linkNav = "whitespace-nowrap font-sans text-xs uppercase tracking-[0.2em] text-cream/80 transition-colors hover:text-gold";
const botao = "whitespace-nowrap px-5 py-3 font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300";

export const Header = () => (
  <header className="fixed inset-x-0 top-0 z-50">
    <div aria-hidden className="absolute inset-0 bg-ink/80 backdrop-blur" />
    <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-between gap-10 px-6">
      <Link href="/" aria-label="Elevation, início" className="relative z-50 flex shrink-0 items-center gap-3">
        <Monograma size={40} priority />
        <span className="font-serif text-lg uppercase tracking-[0.3em] text-cream">{marca.nome}</span>
      </Link>
      <nav className="hidden items-center gap-6 xl:flex">
        {nav.filter((item) => item.href !== "/").map((item) => (
          <Link key={item.href} href={item.href} className={linkNav}>
            {item.label}
          </Link>
        ))}
        <IntentLink href="/evento#patrocinar" intent="patrocinar" className={linkNav}>
          Patrocinar
        </IntentLink>
        <div className="flex items-center gap-3">
          <a href={marca.grupoWhatsapp} target="_blank" rel="noopener noreferrer" className={`${botao} border border-gold text-gold hover:bg-gold hover:text-ink`}>
            Entrar no grupo
          </a>
          <Link href={ingressosHref} className={`${botao} bg-gold text-ink hover:bg-gold-light`}>
            Garantir ingresso
          </Link>
        </div>
      </nav>
      <div className="relative z-50 flex items-center gap-6 xl:hidden">
        <Link href={ingressosHref} className={`${botao} hidden bg-gold text-ink hover:bg-gold-light sm:inline-flex`}>
          Ingressos
        </Link>
        <MobileMenu items={nav} />
      </div>
    </div>
  </header>
);
