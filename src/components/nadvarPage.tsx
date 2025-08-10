'use client';

import { ReactNode } from "react";

interface NadvarProps {
  title: string;
  left?: ReactNode;     // botón/menú extremo izquierdo
  right?: ReactNode;    // botón/acción extremo derecho
  children?: ReactNode; // contenido centrado bajo el título (opcional)
  className?: string;
}

export default function NadvarPage({ title, left, right, children, className }: NadvarProps) {
  return (
    <div
      className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 p-4 bg-bg-light rounded-b-2xl ${className ?? ""}`}
    >
      {/* Izquierda */}
      <div className="justify-self-start min-w-[2.5rem] flex items-center">
        {left ?? null}
      </div>

      {/* Centro */}
      <div className="justify-self-center text-center">
        <p className="text-xl font-bold leading-tight">{title}</p>
        {children ? <div className="mt-2">{children}</div> : null}
      </div>

      {/* Derecha */}
      <div className="justify-self-end min-w-[2.5rem] flex items-center">
        {right ?? null}
      </div>
    </div>
  );
}
