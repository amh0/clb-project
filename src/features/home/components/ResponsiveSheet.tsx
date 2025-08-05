"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { ChevronDown, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineaCercana } from "@/types/linea";

interface ResponsiveSheetProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  lineasCercanas: LineaCercana[];
  selectedLineaIndex: number;
  setSelectedLineaIndex: (index: number) => void;
  sideDesktop?: "right" | "left";
}

export default function ResponsiveSheet({
  open,
  onOpenChange,
  lineasCercanas,
  selectedLineaIndex,
  setSelectedLineaIndex,
  sideDesktop = "right",
}: ResponsiveSheetProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Protección contra SSR
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(min-width: 640px)");
      const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
      mq.addEventListener("change", handler);
      setIsDesktop(mq.matches);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? sideDesktop : "bottom"}
        className={
          isDesktop
            ? "hidden sm:flex h-full w-[350px] flex-col z-50 bg-white text-gray-800 rounded-l-2xl shadow-lg"
            : "sm:hidden h-[450px] flex w-full flex-col z-50 bg-white text-gray-800 rounded-t-2xl shadow-lg"
        }
      >
        {/* Header con timeline */}
        <div className="p-0">
          <div className="relative m-4 rounded-2xl bg-white shadow-lg p-4">
            <div className="grid grid-cols-[auto_1fr] gap-4 items-stretch">
              <div className="flex flex-col items-center justify-between h-full py-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <div className="flex-1 w-px bg-gray-300 my-1"></div>
                <div className="w-px flex-1 bg-gray-300"></div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              <div>
                <div className="flex items-baseline">
                  <span className="text-purple-700 font-semibold">Desde:</span>
                  <span className="ml-1 text-gray-500">Ruta actual</span>
                </div>
                <hr className="border-t border-gray-200 my-2" />
                <div>
                  <span className="text-gray-500">A: Destino Seleccionado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de rutas cercanas */}
        <div className="px-6 mt-6 flex-1 overflow-y-auto">
          <h3 className="text-sm font-medium text-black mb-2">Rutas Cercanas:</h3>
          {lineasCercanas.length === 0 ? (
            <div className="text-center text-gray-400 py-4">No se encontraron líneas</div>
          ) : (
            <div className="space-y-3">
              {lineasCercanas.map((linea, index) => (
                <div
                  key={linea._id || index}
                  className={`flex items-center justify-between ${
                    selectedLineaIndex === index ? "bg-bg2" : "bg-white"
                  } border border-gray-100 rounded-xl px-4 py-3 shadow`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Bus className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-bg1 font-medium">Minibus {linea.number}</span>
                  </div>
                  <Button
                    className="bg-blue-500 text-white py-1 px-4 rounded-full hover:bg-blue-600"
                    onClick={() => setSelectedLineaIndex(index)}
                  >
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
