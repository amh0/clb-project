"use client";

import { useLineasStore } from "@/stores/lineasStore";
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
    <div className="relative h-screen w-screen ">
      <div className="absolute top-2 left-2 bg-ocean text-white z-[100] rounded-2xl p-2">
        <h2 className="font-bold text-2xl">
          Linea: {linea.number}
        </h2>
      </div>
      <MapContainer
        center={[linea.points[0].lon, linea.points[0].lat]}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full z-0"
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

        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
}

export default LineDetailPage;
