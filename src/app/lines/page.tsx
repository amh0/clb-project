"use client";

import React, { useEffect, useMemo, useState } from "react";
import Nadvar from "@/components/nadvar";
import NadvarPage from "@/components/nadvarPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import { MapPinned } from "lucide-react";
import { fetchAllLineas } from "@/lib/endpoints";
import { useLineasStore } from "@/stores/lineasStore";

type Linea = {
  _id: string;
  number: number;
  syndicate: string;
  zone?: string; // opcional, para la 2da línea gris
  points: Array<{ lat: number; lon: number }>;
};

export default function LinesWithMapPage() {
  const lineas = useLineasStore((s) => s.lineas) as Linea[] | undefined;
  const setLineas = useLineasStore((s) => s.setLineas);
  const [loading, setLoading] = useState(!lineas);
  const [error, setError] = useState<string | null>(null);

  const [sheetLinesOpen, setSheetLinesOpen] = useState(true); // listado (abajo)
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!lineas) {
      (async () => {
        try {
          const datos = await fetchAllLineas();
          setLineas(datos.data.lines);
        } catch (err) {
          console.error(err);
          setError("No se pudieron cargar las líneas.");
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [lineas, setLineas]);

  const selectedLine = useMemo(
    () => lineas?.find((l) => l._id === selectedId) ?? null,
    [lineas, selectedId]
  );

  const initialCenter: [number, number] = selectedLine?.points?.[0]
    ? [selectedLine.points[0].lon, selectedLine.points[0].lat]
    : lineas?.[0]?.points?.[0]
    ? [lineas[0].points[0].lon, lineas[0].points[0].lat]
    : ([-68.15, -16.5] as [number, number]); // fallback

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-100">
      {/* Header fijo */}
      <div className="absolute top-0 left-0 w-full">
        <NadvarPage
          title={
            selectedLine ? `Línea ${selectedLine.number}` : "Mostrar Rutas"
          }
          left={
            <Nadvar />

          }
          right={
            <Button
              variant="outline"
              onClick={() => setSheetLinesOpen(true)}
              className="rounded-full bg-bg2 text-white hover:bg-green-600"
              title="Ver rutas"
            >
              <MapPinned />
            </Button>
          }
        >

        </NadvarPage>
      </div>

      {/* Mapa de fondo */}
      <MapContainer
        key={selectedLine?._id ?? "map"}
        center={initialCenter}
        zoom={13}
        scrollWheelZoom
        zoomControl={false}
        className="absolute top-[60px] bottom-0 left-0 right-0 z-0"
      >
        <LayersControl position="bottomright">
          <LayersControl.BaseLayer checked name="OSM">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Humanitarian">
            <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {selectedLine && (
          <Polyline
            positions={selectedLine.points.map((p) => [p.lon, p.lat])}
            pathOptions={{ color: "#1e40af", weight: 8 }}
          />
        )}
        <ZoomControl position="topright" />
      </MapContainer>

      {/* Sheet inferior: listado scrollable */}
      <Sheet open={sheetLinesOpen} onOpenChange={setSheetLinesOpen}>
        <SheetContent
          side="bottom"
          className="h-[70vh] p-0 bg-white border-t rounded-t-2xl overflow-hidden"
        >
          <SheetHeader className="px-4 pt-3 pb-2">
            <SheetTitle className="text-base font-semibold">
              {loading
                ? "Cargando líneas…"
                : `Selecciona una línea${lineas ? ` (${lineas.length})` : ""}`}
            </SheetTitle>
          </SheetHeader>

          <div className="h-[calc(70vh-56px)] overflow-y-auto px-4 pb-6">
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {!loading &&
                !error &&
                lineas?.map((linea) => {
                  const isSelected = selectedId === linea._id;

                  return (
                    <Card
                      key={linea._id}
                      aria-selected={isSelected}
                      className={[
                        "relative bg-white rounded-2xl p-3 border-1 transition-all duration-200",
                        "hover:shadow-[0_6px_20px_rgba(20,162,146,0.12)]",
                        isSelected
                          ? "border-[#14a292] shadow-[0_10px_24px_rgba(20,162,146,0.18)] ring-2 ring-[#14a292]/25"
                          : "border-[#14a292]",
                      ].join(" ")}
                    >
                      {/* Barra de acento a la izquierda cuando está seleccionada */}
                      <span
                        className={[
                          "pointer-events-none absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all duration-200",
                          isSelected ? "bg-[#14a292]" : "bg-transparent",
                        ].join(" ")}
                      />

                      <CardContent className="p-0">
                        <div className="flex items-center justify-between gap-3">
                          {/* Texto */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-[17px] font-semibold text-gray-900 truncate">
                                Minibus {linea.number}
                              </div>
                              {isSelected && (
                                <span className="text-[11px] text-[#14a292] bg-[#14a292]/10 px-2 py-0.5 rounded-full border border-[#14a292]/30 whitespace-nowrap">
                                  Seleccionada
                                </span>
                              )}
                            </div>
                            <div className="text-[13px] text-gray-500 truncate">
                              {linea.syndicate}
                            </div>
                            {linea.zone && (
                              <div className="text-[13px] text-gray-500 truncate">
                                {linea.zone}
                              </div>
                            )}
                          </div>

                          {/* Botón */}
                          <Button
                            variant="variant1"
                            size="sm"
                            onClick={() => {
                              setSelectedId(linea._id);
                              setSheetLinesOpen(false);
                            }}
                            className={[
                              "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                              "bg-[#14a292] text-white hover:bg-[#108578]",
                              isSelected ? "ring-2 ring-[#14a292]/40" : "",
                            ].join(" ")}
                            title="Ver Ruta"
                          >
                            Ver Ruta
                            {/* puedes dejar el icono si quieres */}
                            {/* <CircleCheck className="w-4 h-4 ml-1" /> */}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>

            <div className="h-4" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
