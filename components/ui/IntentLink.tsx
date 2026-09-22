"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { setIntent, type Modo } from "@/lib/intent";

type Props = { href: string; intent: Modo; className?: string; onClick?: () => void; children: ReactNode };

export const IntentLink = ({ href, intent, className, onClick, children }: Props) => (
  <Link
    href={href}
    className={className}
    onClick={() => {
      setIntent(intent);
      onClick?.();
    }}
  >
    {children}
  </Link>
);
