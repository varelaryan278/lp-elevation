import type { ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

export const Eyebrow = ({ children, className = "" }: Props) => (
  <p className={`font-sans text-xs uppercase tracking-[0.25em] text-(--accent) ${className}`}>{children}</p>
);
