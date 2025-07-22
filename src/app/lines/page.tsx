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
import { ChevronRight } from "lucide-react";
import { fetchAllLineas } from "@/lib/endpoints";
import React, { useEffect, useState } from "react";
import { useLineasStore } from "@/stores/lineasStore"; // 🔁 importa tu store
import Link from "next/link";

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
    <div className="bg-midnight h-screen">
      <header className="flex pt-2 mx-2 gap-2">
        <div><Nadvar /></div>
        <div className="flex-1 md:max-w-2xl">
          <Input
            type="text"
            placeholder="Search"
            className="bg-ocean text-white placeholder:text-white"
          />
        </div>
      </header>

      <main className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p>Cargando líneas…</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && lineas?.map((linea) => (
          <Link href={`/lines/${linea._id}`} key={linea._id}>
            <Card key={linea._id}>
              <CardHeader>
                <CardTitle>Línea {linea.number}</CardTitle>
                <CardDescription>{linea.syndicate}</CardDescription>
                <CardAction>
                  <ChevronRight />
                </CardAction>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </main>
    </div>
  );
}

export default LinesPage;
