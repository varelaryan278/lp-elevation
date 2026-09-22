import Image from "next/image";

type Props = { size: number; className?: string; priority?: boolean };

export const Monograma = ({ size, className = "", priority = false }: Props) => (
  <Image
    src="/img/brand/monograma.png"
    alt="Monograma Elevation"
    width={size}
    height={size}
    priority={priority}
    className={className}
  />
);
