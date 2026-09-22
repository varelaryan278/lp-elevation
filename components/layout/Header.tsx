import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Monograma } from "@/components/ui/Monograma";
import { marca, nav } from "@/content/marca";
import { MobileMenu } from "./MobileMenu";

export const Header = () => (
  <header className="fixed inset-x-0 top-0 z-50">
    <div aria-hidden className="absolute inset-0 bg-ink/80 backdrop-blur" />
    <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
      <Link href="/" aria-label="Elevation, início" className="relative z-50 flex items-center gap-3">
        <Monograma size={40} priority />
        <span className="font-serif text-lg uppercase tracking-[0.3em] text-cream">{marca.nome}</span>
      </Link>
      <nav className="hidden items-center gap-10 md:flex">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-sans text-xs uppercase tracking-[0.25em] text-cream/80 transition-colors hover:text-gold"
          >
            {item.label}
          </Link>
        ))}
        <Button href="/evento#patrocinar" variant="outline" intent="patrocinar">
          Patrocinar
        </Button>
        <Button href="/evento#interesse" intent="participar">
          Garantir vaga
        </Button>
      </nav>
      <div className="relative z-50">
        <MobileMenu items={nav} />
      </div>
    </div>
  </header>
);
