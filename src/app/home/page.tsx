"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import HeaderPage from "../../components/header";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  LayersControl,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
import { Polyline } from "react-leaflet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { LocateFixed } from "lucide-react";
import { fetchLineasCercanas } from "@/lib/endpoints";

// Parche iconos Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const position = [-16.5, -68.15];

function MarcadorCentral({ onGuardar }) {
  const map = useMap();

  const guardarUbicacion = () => {
    const center = map.getCenter();
    onGuardar(center);
    alert(
      `Guardado: Lat ${center.lat.toFixed(6)}, Lng ${center.lng.toFixed(6)}`
    );
  };

  return (
    <div className="absolute top-36 left-1/2 -translate-x-1/2 z-[1000]">
      <button
        onClick={guardarUbicacion}
        className="bg-white text-black px-4 py-2 rounded shadow"
      >
        Guardar ubicación
      </button>
    </div>
  );
}

export default function HomePage() {
  const [elegirEnMapaDestino, setElegirEnMapaDestino] = useState(false);
  const [coordenadasDestino, setCoordenadasDestino] = useState(null);
  const cerrarDialogRef = useRef(null);

  const [elegirEnMapaOrigen, setElegirEnMapaOrigen] = useState(false);
  const [coordenadasOrigen, setCoordenadasOrigen] = useState(null);
  const cerrarDialogOrigenRef = useRef(null);

  const [lineasCercanas, setLineasCercanas] = useState([]);
  const [selectedLineaIndex, setSelectedLineaIndex] = useState(0);

  const [open, setOpen] = useState(false);

  // Al recibir nuevas líneas, selecciona la primera por defecto
  useEffect(() => {
    if (lineasCercanas.length > 0) {
      setSelectedLineaIndex(0);
    }
  }, [lineasCercanas]);

  const handleElegirDestino = () => {
    setElegirEnMapaDestino(true);
    if (cerrarDialogRef.current) cerrarDialogRef.current.click();
  };

  const handleElegirOrigen = () => {
    setElegirEnMapaOrigen(true);
    if (cerrarDialogOrigenRef.current) cerrarDialogOrigenRef.current.click();
  };

  const handleGuardarDestino = (coords) => {
    setCoordenadasDestino(coords);
    setElegirEnMapaDestino(false);
  };

  const handleGuardarOrigen = (coords) => {
    setCoordenadasOrigen(coords);
    setElegirEnMapaOrigen(false);
  };

  const handleClearUbicaciones = () => {
    setElegirEnMapaDestino(false);
    setElegirEnMapaOrigen(false);
    setCoordenadasDestino(null);
    setCoordenadasOrigen(null);
    setLineasCercanas([]);
  };

  const handleBuscarLineas = async () => {
    if (!coordenadasDestino) {
      alert("Primero seleccione el punto de destino en el mapa");
      return;
    }

    console.log("Query params para líneas cercanas:", {
      lat: coordenadasDestino.lat,
      lon: coordenadasDestino.lng,
    });

    setOpen(true);

    try {
      const response = await fetchLineasCercanas(
        coordenadasDestino.lng,
        coordenadasDestino.lat
      );
      console.log("Respuesta completa del endpoint:", response);
      console.log("Líneas encontradas:", response.data.lines);
      setLineasCercanas(response.data.lines);
    } catch (error) {
      console.error("Error al buscar líneas cercanas:", error);
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute top-0 left-0 w-full z-20">
        <HeaderPage
          setElegirEnMapaDestino={setElegirEnMapaDestino}
          onElegirDestinoDesdeMapa={handleElegirDestino}
          cerrarDialogRef={cerrarDialogRef}
          setElegirEnMapaOrigen={setElegirEnMapaOrigen}
          onElegirOrigenDesdeMapa={handleElegirOrigen}
          cerrarDialogOrigenRef={cerrarDialogOrigenRef}
          onClearUbicaciones={handleClearUbicaciones}
          onBuscarLineas={handleBuscarLineas}
        />
      </div>

      <MapContainer
        center={position}
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

        {elegirEnMapaDestino && (
          <MarcadorCentral onGuardar={handleGuardarDestino} />
        )}

        {elegirEnMapaOrigen && (
          <MarcadorCentral onGuardar={handleGuardarOrigen} />
        )}

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
            positions={
              lineasCercanas[selectedLineaIndex].points.map((p) => [p.lon, p.lat])
            }
            pathOptions={{ color: "blue", weight: 8 }}
          />
        )}

        <ZoomControl position="bottomright" />
      </MapContainer>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[400px] flex flex-col z-[100] bg-variant1 from-[#1e293b] to-[#0f172a] text-white rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="text-white text-xl">Líneas Encontradas</SheetTitle>
            <SheetDescription className="text-white">
              Total líneas encontradas: {lineasCercanas.length}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {lineasCercanas.length === 0 ? (
              <div className="text-center text-white">
                No se encontraron líneas
              </div>
            ) : (
              lineasCercanas.map((linea, index) => (
                <Button
                  key={linea._id || index}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-medium transition-colors duration-300
        ${index === selectedLineaIndex ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white bg-midnight" }
      `}
                  onClick={() => setSelectedLineaIndex(index)}
                >
                  <h1 className="font-bold">Línea #{index + 1}</h1>
                  <p>Nombre: {linea.number}</p>
                </Button>
              ))
            )}
          </div>

          <div className="border-t border-variant1 pt-4">
            <Button onClick={() => setOpen(false)} className="w-full text-center  bg-white text-variant1  hover:bg-white/80 transition">
              Cerrar panel
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {lineasCercanas && (
        <Button className="absolute bottom-2 left-2 z-30 bg-ocean text-white rounded-2xl ring-2 ring-midnight" variant={"ghost"} onClick={() => setOpen(!open)}>
          mostrar lineas
        </Button>
      )}

      {(elegirEnMapaDestino || elegirEnMapaOrigen) && (
        <div className="absolute top-1/2 left-1/2 z-[500] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <LocateFixed className="size-9" />
        </div>
      )}
    </div>
  );
}
