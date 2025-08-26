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
import { useMapStore } from "@/stores/useMapStore";

const DEFAULT_POSITION: [number, number] = [-16.5, -68.15];

export default function MapSection() {
  const {
    elegirEnMapaDestino,
    elegirEnMapaOrigen,
    coordenadasDestino,
    coordenadasOrigen,
    lineasCercanas,
    selectedLineaIndex,
    setCoordenadasDestino,
    setCoordenadasOrigen,
    isSheetOpen,
  } = useMapStore();

  return (
    <MapContainer
      center={DEFAULT_POSITION}
      zoom={13}
      scrollWheelZoom
      zoomControl={false}
      className={`h-full w-full z-0 ${isSheetOpen ? "pointer-events-none" : ""}`}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OSM">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Humanitarian">
          <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
      </LayersControl>

      {elegirEnMapaDestino && <MarcadorCentral onGuardar={setCoordenadasDestino} />}
      {elegirEnMapaOrigen && <MarcadorCentral onGuardar={setCoordenadasOrigen} />}

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

      <ZoomControl position="topright" />
    </MapContainer>
  );
}
