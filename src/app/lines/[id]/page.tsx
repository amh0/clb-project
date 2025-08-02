"use client";

import NadvarPage from "@/components/nadvarPage";
import { Button } from "@/components/ui/button";
import { useLineasStore } from "@/stores/lineasStore";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  LayersControl,
  Polyline,
} from "react-leaflet";

function LineDetailPage() {
  const { id } = useParams();
  const lineas = useLineasStore((s) => s.lineas);
  const linea = lineas?.find((l) => l._id === id);

  if (!linea) return <p className="p-4 text-white">Cargando línea...</p>;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Header flotante */}
      <div className="absolute top-0 left-0 w-full z-[1000]">
        <NadvarPage title={`Línea ${linea.number}`}>
          <Link href="/lines">
            <Button className="bg-bg2 text-white text-xl cursor-pointer rounded-full hover:bg-green-600">
              <ChevronLeft />
            </Button>
          </Link>
        </NadvarPage>
      </div>

      {/* Mapa ocupa todo menos el header */}
      <MapContainer
        center={[linea.points[0].lon, linea.points[0].lat]}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        className="absolute top-[60px] bottom-0 left-0 right-0 z-0" // Ajusta si tu header es más alto
      >
        <LayersControl position="bottomright">
          <LayersControl.BaseLayer checked name="OSM">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Humanitarian">
            <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
        </LayersControl>

        <Polyline
          positions={linea.points.map((p) => [p.lon, p.lat])}
          pathOptions={{ color: "blue", weight: 8 }}
        />

        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
}

export default LineDetailPage;
