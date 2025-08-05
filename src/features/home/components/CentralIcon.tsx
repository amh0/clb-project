"use client";
import Image from "next/image";

interface CentralIconProps {
  visible: boolean;
}

export default function CentralIcon({ visible }: CentralIconProps) {
  if (!visible) return null;
  return (
    <div className="absolute top-1/2 left-1/2 z-[500] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <Image src="/icons/icon-ubicacion.svg" alt="Ubicación" width={48} height={48} priority />
    </div>
  );
}
