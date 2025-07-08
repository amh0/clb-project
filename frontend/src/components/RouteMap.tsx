// src/components/RouteMap.tsx
import React, { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Ruta {
  coordenadas: [number, number][];
  color: string;
}

interface Props {
  rutas: Ruta[];
  zoom?: number;
}

const RouteMap = ({ rutas, zoom = 15 }: Props) => {
  const [matchedRutas, setMatchedRutas] = useState<{ coords: [number, number][], color: string }[]>([]);

  const center = useMemo(() => {
    const [lng, lat] = rutas[0]?.coordenadas[0] || [-68.14, -16.51];
    return [lat, lng];
  }, [rutas]);

  useEffect(() => {
    const controller = new AbortController();

    async function procesarRutas() {
      const resultados: { coords: [number, number][], color: string }[] = [];

      for (const ruta of rutas) {
        try {
          const coordStr = ruta.coordenadas.map(([lng, lat]) => `${lng},${lat}`).join(";");
          const url = `https://router.project-osrm.org/match/v1/driving/${coordStr}?geometries=geojson&overview=full&tidy=true`;

          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) throw new Error(`Error OSRM (${res.status})`);

          const json = await res.json();
          if (!json.matchings?.length) continue;

          const coords: [number, number][] = json.matchings[0].geometry.coordinates;
          resultados.push({ coords, color: ruta.color });
        } catch (e) {
          console.error("Error en ruta:", e);
        }
      }

      setMatchedRutas(resultados);
    }

    procesarRutas();
    return () => controller.abort();
  }, [rutas]);

  return (
    <MapContainer center={center} zoom={zoom} className="w-full h-[600px] z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {matchedRutas.map((ruta, index) => (
        <Polyline
          key={index}
          positions={ruta.coords.map(([lng, lat]) => [lat, lng])}
          weight={5}
          color={ruta.color}
        />
      ))}
    </MapContainer>
  );
};

export default RouteMap;
