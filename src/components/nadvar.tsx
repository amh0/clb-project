"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Route, Map, SquarePen, Heart, UserPlus, Bolt, Pencil  } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle
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
        ${isActive ? "text-bg2" : "text-black hover:text-bg2"}
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
            className="bg-bg2 text-white transition rounded-full hover:bg-green-600 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="bg-white text-black border-none"
        >
          <SheetHeader className="bg-bg1">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-amber-600 mx-auto">

              </div>
              <SheetTitle className="text-2xl font-semibold tracking-tight text-white mb-12 text-center">
                CienciaLink Bolivia
              </SheetTitle>
                <Button className="text-xl absolute px-8 py-1 right-0 bottom-0 border-2 border-white text-white" variant={"ghost"}>
                  Editar
                  <Pencil />
                </Button>
            </div>
          </SheetHeader>


          <div className="mt-6 space-y-6 w-full">
            <nav className="flex flex-col gap-2 w-full text-xl">
              <NavLink href="/home" label="Planificador de rutas" icon={Route} />
              <NavLink href="/lines" label="Mostrar ruta" icon={Map} />
              <NavLink href="/tarifas" label="Tarifa de Transporte" icon={UserPlus} />
              <NavLink href="/lines" label="Redes Sociales" icon={Heart} />
              <NavLink href="/drawMap" label="Editor" icon={SquarePen} />
              <NavLink href="/lines" label="Configuracion" icon={Bolt} />
            </nav>
          </div>

          <Button className="absolute bottom-4 left-0 text-bg2 text-xl border-b-2 border-bg2">
            Logout
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Nadvar;
