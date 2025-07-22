"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';

type Point = { lat: number; lon: number };

interface Props {
  points: Point[];
  zoom?: number;
}

export default function OSRMMap({ points, zoom = 15 }: Props) {
  const [matchedCoords, setMatchedCoords] = useState<[number, number][]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);

  // Construye "lon,lat;lon,lat;..."
  const coordStr = points.map(p => `${p.lon},${p.lat}`).join(';');

  useEffect(() => {
    if (points.length < 2) return;
    const controller = new AbortController();
    const url = `https://router.project-osrm.org/match/v1/walking/${coordStr}?geometries=geojson&overview=full&tidy=true`;

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`OSRM error ${res.status}`);
        return res.json();
      })
      .then(json => {
        console.log('OSRM raw response:', json);
        setRawResponse(json);

        const match = json.matchings?.[0];
        if (match?.geometry?.coordinates) {
          const coords = match.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon] as [number, number]
          );
          setMatchedCoords(coords);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') console.error('Fetch OSRM failed:', err);
      });

    return () => controller.abort();
  }, [coordStr, points.length]);

  console.log("matchedCoords: ", matchedCoords)


  const center: [number, number] = points.length
    ? [points[0].lat, points[0].lon]
    : [0, 0];

  return (
    <div>
      <MapContainer center={center} zoom={zoom} className="w-full h-[600px]">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {matchedCoords.length > 0 && (
          <Polyline positions={matchedCoords} color="blue" weight={5} />
        )}
      </MapContainer>

      <pre className="mt-4 p-2 bg-gray-100 overflow-auto text-sm">
        {matchedCoords
          ? JSON.stringify(matchedCoords, null, 2)
          : 'Esperando respuesta de OSRM...'}
      </pre>
    </div>
  );
}
