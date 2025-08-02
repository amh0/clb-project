'use client';

import { ReactNode } from "react";

interface NadvarProps {
  children: ReactNode,
  title: string
}

export default function NadvarPage(props: NadvarProps) {
  const {children, title} = props
  return (
    <header className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center justify-center">
          {children}
        </div>

        <div className="mx-auto">
          <p className="text-xl font-bold">{title}</p>
        </div>
      </header>
  );
}
