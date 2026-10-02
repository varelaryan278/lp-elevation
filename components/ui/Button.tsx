import Link from "next/link";
import type { ReactNode } from "react";
import type { Modo } from "@/lib/intent";
import { IntentLink } from "./IntentLink";

const variants = {
  primary: "bg-gold text-ink hover:bg-gold-light",
  outline: "border border-gold text-gold hover:bg-gold hover:text-ink",
} as const;

type Props = {
  href: string;
  variant?: keyof typeof variants;
  intent?: Modo;
  className?: string;
  children: ReactNode;
};

export const Button = ({ href, variant = "primary", intent, className = "", children }: Props) => {
  const classes = `inline-flex items-center justify-center px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] transition-colors duration-300 ${variants[variant]} ${className}`;

  if (href.startsWith("https://")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  if (intent) {
    return (
      <IntentLink href={href} intent={intent} className={classes}>
        {children}
      </IntentLink>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
};
