import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  primary: "bg-gold text-ink hover:bg-gold-light",
  outline: "border border-gold text-gold hover:bg-gold hover:text-ink",
} as const;

type Props = {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
};

export const Button = ({ href, variant = "primary", className = "", children }: Props) => (
  <Link
    href={href}
    className={`inline-flex items-center justify-center px-8 py-4 font-sans text-xs uppercase tracking-[0.25em] transition-colors duration-300 ${variants[variant]} ${className}`}
  >
    {children}
  </Link>
);
