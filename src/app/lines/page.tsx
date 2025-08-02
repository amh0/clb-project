"use client";
import Nadvar from "@/components/nadvar";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  ChevronRight,
  Circle,
  CircleAlert,
  CircleCheck,
} from "lucide-react";
import { fetchAllLineas } from "@/lib/endpoints";
import React, { useEffect, useState } from "react";
import { useLineasStore } from "@/stores/lineasStore"; // 🔁 importa tu store
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NadvarPage from "@/components/nadvarPage";

function LinesPage() {
  const lineas = useLineasStore((s) => s.lineas);
  const setLineas = useLineasStore((s) => s.setLineas);
  const [loading, setLoading] = useState(!lineas);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lineas) {
      (async () => {
        try {
          const datos = await fetchAllLineas();
          console.log("datos: ", datos.data.lines);
          setLineas(datos.data.lines); // ✅ guarda en Zustand
        } catch (err: any) {
          console.error(err);
          setError("No se pudieron cargar las líneas.");
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false); // si ya hay datos, no cargar
    }
  }, [lineas, setLineas]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NadvarPage title="Mostrar Rutas">
        <Nadvar/>
      </NadvarPage>
      <main className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-bg1 rounded-2xl p-4 mx-2">
        {loading && <p>Cargando líneas…</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading &&
          !error &&
          lineas?.map((linea) => (
            <Card
              key={linea._id}
              className="bg-white rounded-xl p-4 shadow-sm border-0"
            >
              <CardHeader className="flex flex-col gap-2">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <CardTitle className="text-gray-900 font-medium">
                      Línea {linea.number}
                    </CardTitle>
                    <CardDescription className="text-gray-700">
                      {linea.syndicate}
                    </CardDescription>
                  </div>

                  <div className="shrink-0">
                    <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
                      <CircleAlert className="w-4 h-4 fill-green-500 text-white" />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <hr className="border-t border-gray-300" />
              </CardContent>

              <CardFooter className="flex justify-end">
                <Link href={`/lines/${linea._id}`}>
                  <Button
                    size="sm"
                    className="bg-bg2 hover:bg-green-600 text-white rounded-full px-4 py-2 text-xs font-medium cursor-pointer"
                  >
                    VER RUTA
                    <CircleCheck className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
      </main>
    </div>
  );
}

export default LinesPage;
