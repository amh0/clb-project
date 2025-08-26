"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import NadvarPage from "@/components/nadvarPage";
import Nadvar from "@/components/nadvar";
import { Bus } from "lucide-react";

// ⬇️ Solo se usan en desktop
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

interface FareCard {
  id: string;
  title: string;
  price: string; // "Bs. 2,40"
}

const normales: FareCard[] = [
  { id: "normal",   title: "Horario Normal",   price: "Bs. 2,40" },
  { id: "nocturno", title: "Horario Nocturno", price: "Bs. 2,80" },
  { id: "tramo",    title: "Tramo Largo",      price: "Bs. 3,50" },
];

const preferenciales: FareCard[] = [
  { id: "adulto",   title: "Adulto Mayor",     price: "Bs. 2,00" },
  { id: "escolar",  title: "Estudiantil",      price: "Bs. 1,50" },
];

// Centro aprox. La Paz (lon, lat) para Leaflet usando tu convención previa
const LA_PAZ_CENTER: [number, number] = [-16.5, -68.15];

export default function TransportFares() {
  const [selectedId, setSelectedId] = useState<string | null>("normal");

  const renderItem = (fare: FareCard) => {
    const isSelected = selectedId === fare.id;

    return (
      <Card
        key={fare.id}
        onClick={() => setSelectedId(fare.id)}
        className={[
          "cursor-pointer bg-white border border-gray-200 rounded-xl shadow-md",
          "transition-all duration-200 hover:shadow-xl hover:scale-[1.01]",
          isSelected ? "ring-2 ring-bg-light" : "ring-0",
        ].join(" ")}
      >
        <CardContent className="px-3">
          <div className="flex items-center justify-between gap-3">
            {/* izquierda: icono + título */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-[#14a292]/15 flex items-center justify-center shrink-0">
                <Bus className="h-5 w-5 text-[#14a292]" />
              </div>
              <span className="text-[15px] sm:text-base font-medium text-gray-800 truncate">
                {fare.title}
              </span>
            </div>

            {/* derecha: chip de precio */}
            <span
              className={[
                "inline-flex items-center justify-center",
                "rounded-full px-3 py-1 text-[13px] font-semibold shrink-0",
                "shadow-sm bg-[#14a292] text-white",
              ].join(" ")}
            >
              {fare.price}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-gray-50">
      {/* Header fijo */}
      <div className="absolute top-0 left-0 w-full z-[500]">
        <NadvarPage title="Tarifas de Transporte" left={<Nadvar />} />
      </div>

      {/* ====== Mapa de fondo SOLO en desktop ====== */}
      <div className="hidden lg:block absolute top-[60px] bottom-0 left-0 right-0 z-0">
        <MapContainer
          center={LA_PAZ_CENTER}
          zoom={12}
          scrollWheelZoom
          zoomControl={false}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ZoomControl position="topleft" />
        </MapContainer>
      </div>

      {/* ====== Panel flotante (desktop) ====== */}
      <div className="hidden lg:block absolute right-6 top-[96px] z-[400]">
        <div
          className={`
            w-[420px] max-h-[72vh] rounded-[22px]
            bg-white/90 backdrop-blur-md
            border border-[#14a292]/25
            shadow-[0_20px_40px_rgba(0,0,0,0.18)]
          `}
        >
          <div className="px-5 py-4 border-b bg-white/80 backdrop-blur-md rounded-t-[22px]">
            <h3 className="text-lg font-semibold text-gray-900">Tarifas de Transporte</h3>
          </div>

          <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "calc(72vh - 64px)" }}>
            {/* Sección normales */}
            {normales.map(renderItem)}

            {/* Subtítulo sección preferenciales */}
            <div className="px-1 pt-2 text-sm font-semibold text-gray-600">
              Tarifas Preferenciales
            </div>

            {preferenciales.map(renderItem)}
          </div>
        </div>
      </div>

      {/* ====== Contenido original para móviles/tablet ====== */}
      <div className="lg:hidden pt-[60px]">
        {/* Contenedor con borde verde como en tu versión móvil */}
        <div className="mx-4 sm:mx-8 mt-3 mb-8">
          <div className="bg-white rounded-2xl border-2 border-[#14a292] p-3">
            <div className="p-3">
              <div className="space-y-3">
                {normales.map(renderItem)}

                <div className="px-1 pt-1 text-2xl font-bold sm:text-sm text-gray-600">
                  Tarifas Preferenciales
                </div>

                {preferenciales.map(renderItem)}
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
