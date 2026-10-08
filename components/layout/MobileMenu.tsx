"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IntentLink } from "@/components/ui/IntentLink";
import { ingressosHref } from "@/content/evento";
import { marca } from "@/content/marca";
import type { NavItem } from "@/content/types";

type Props = { items: NavItem[] };

export const MobileMenu = ({ items }: Props) => {
  const [openAt, setOpenAt] = useState<string | null>(null);
  const pathname = usePathname();
  const open = openAt === pathname;
  const close = () => setOpenAt(null);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpenAt(open ? null : pathname)}
        className="font-sans text-xs uppercase tracking-[0.25em] text-cream"
      >
        {open ? "Fechar" : "Menu"}
      </button>
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-wine">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="font-serif text-3xl uppercase tracking-[0.3em] text-cream"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-6 flex w-full max-w-xs flex-col gap-4 px-6">
            <Link
              href={ingressosHref}
              onClick={close}
              className="bg-gold px-8 py-4 text-center font-sans text-xs uppercase tracking-[0.25em] text-ink"
            >
              Garantir ingresso
            </Link>
            <a
              href={marca.grupoWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="border border-gold px-8 py-4 text-center font-sans text-xs uppercase tracking-[0.25em] text-gold"
            >
              Entrar no grupo
            </a>
          </div>
          <IntentLink
            href="/evento#patrocinar"
            intent="patrocinar"
            onClick={close}
            className="font-sans text-xs uppercase tracking-[0.25em] text-cream/80 underline-offset-4 hover:underline"
          >
            Patrocinar
          </IntentLink>
        </div>
      )}
    </div>
  );
};
