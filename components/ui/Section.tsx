import type { ReactNode } from "react";

const variants = {
  ink: "bg-ink text-cream/90",
  cream: "bg-cream text-ink",
  wine: "bg-wine text-cream/90",
  plum: "bg-plum text-cream/90",
} as const;

export type SectionBg = keyof typeof variants;

type Props = { bg: SectionBg; id?: string; className?: string; children: ReactNode };

export const Section = ({ bg, id, className = "", children }: Props) => (
  <section id={id} className={`${variants[bg]} py-24 md:py-40 ${className}`}>
    <div className="mx-auto max-w-6xl px-6">{children}</div>
  </section>
);
