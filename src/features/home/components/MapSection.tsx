"use client";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import MarcadorCentral from "./MarcadorCentral";
import { Punto, LineaCercana } from "@/types/linea";

interface MapSectionProps {
  elegirDestino: boolean;
  elegirOrigen: boolean;
  coordenadasDestino: L.LatLng | null;
  coordenadasOrigen: L.LatLng | null;
  lineasCercanas: LineaCercana[];
  selectedLineaIndex: number;
  onGuardarDestino: (coords: L.LatLng) => void;
  onGuardarOrigen: (coords: L.LatLng) => void;
  mapDisabled?: boolean;
}

const DEFAULT_POSITION: [number, number] = [-16.5, -68.15];

export default function MapSection({
  elegirDestino,
  elegirOrigen,
  coordenadasDestino,
  coordenadasOrigen,
  lineasCercanas,
  selectedLineaIndex,
  onGuardarDestino,
  onGuardarOrigen,
  mapDisabled = false,
}: MapSectionProps) {
  return (
    <MapContainer
      center={DEFAULT_POSITION}
      zoom={13}
      scrollWheelZoom
      zoomControl={false}
      className={`h-full w-full z-0 ${mapDisabled ? "pointer-events-none" : ""}`}
    >
      <LayersControl position="topleft">
        <LayersControl.BaseLayer checked name="OSM">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Humanitarian">
          <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
      </LayersControl>

      {elegirDestino && <MarcadorCentral onGuardar={onGuardarDestino} />}
      {elegirOrigen && <MarcadorCentral onGuardar={onGuardarOrigen} />}

      {coordenadasDestino && (
        <Marker position={[coordenadasDestino.lat, coordenadasDestino.lng]}>
          <Popup>Destino seleccionado</Popup>
        </Marker>
      )}
      {coordenadasOrigen && (
        <Marker position={[coordenadasOrigen.lat, coordenadasOrigen.lng]}>
          <Popup>Origen seleccionado</Popup>
        </Marker>
      )}

      {lineasCercanas[selectedLineaIndex] && (
        <Polyline
          positions={lineasCercanas[selectedLineaIndex].points.map((p: Punto) => [p.lon, p.lat])}
          pathOptions={{ weight: 8 }}
        />
      )}

      <ZoomControl position="topleft" />
    </MapContainer>
  );
}
