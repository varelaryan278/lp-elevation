"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export const Cortina = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsDismissed(true), 3000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (isDismissed) return null;

  return (
    <div aria-hidden className="curtain pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      <div className="curtain-panel curtain-left absolute inset-y-0 left-0 w-1/2 border-r border-rose/40" />
      <div className="curtain-panel curtain-right absolute inset-y-0 right-0 w-1/2 border-l border-rose/40" />
      <div className="curtain-bar absolute inset-x-0 top-0 h-6 bg-linear-to-b from-[#c9906f] to-[#7a4a36] shadow-[0_6px_20px_rgba(0,0,0,.6)]" />
      <div className="curtain-seal absolute top-1/2 left-1/2 w-24 -translate-x-1/2 -translate-y-1/2 sm:w-28">
        <Image src="/img/lp/monograma.webp" alt="" width={565} height={682} priority className="h-auto w-full" />
      </div>
    </div>
  );
};
