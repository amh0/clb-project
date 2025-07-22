"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Route, Map } from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";

// ✅ NavLink sin NavigationMenu
function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-300
        ${isActive ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}
      `}
    >
      <Icon className="w-5 h-5 opacity-90" />
      <span className="leading-none">{label}</span>
    </Link>
  );
}

function Nadvar() {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="bg-variant1 text-white hover:bg-midnight/80 transition"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="bg-variant1 from-[#1e293b] to-[#0f172a] text-white border-none"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl font-semibold tracking-tight text-white">
              CienciaLink-App
            </SheetTitle>
            <SheetDescription className="text-sm text-slate-300">
              La Paz - Bolivia
            </SheetDescription>
          </SheetHeader>

          <ModeToggle/>

          <div className="mt-6 space-y-6 w-full">
            <nav className="flex flex-col gap-2 w-full">
              <NavLink href="/home" label="Planificador de rutas" icon={Route} />
              <NavLink href="/lines" label="Mostrar ruta" icon={Map} />
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Nadvar;
