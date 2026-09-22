"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem } from "@/content/types";

type Props = { items: NavItem[] };

export const MobileMenu = ({ items }: Props) => {
  const [openAt, setOpenAt] = useState<string | null>(null);
  const pathname = usePathname();
  const open = openAt === pathname;
  const close = () => setOpenAt(null);

  return (
    <div className="md:hidden">
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
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-wine">
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
          <Link
            href="/evento#interesse"
            onClick={close}
            className="mt-6 bg-gold px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] text-ink"
          >
            Garantir vaga
          </Link>
          <Link
            href="/evento#patrocinar"
            onClick={close}
            className="border border-gold px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] text-gold"
          >
            Patrocinar
          </Link>
        </div>
      )}
    </div>
  );
};
