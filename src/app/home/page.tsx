"use client";
import Image from "next/image";
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
  Polyline,
} from "react-leaflet";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Bus, ChevronRight, ChevronDown } from "lucide-react";
import { fetchLineasCercanas } from "@/lib/endpoints";
import FooterPage from "@/components/footer";
import { LineaCercana, Punto } from "@/types/linea";

// Parche iconos Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_POSITION: [number, number] = [-16.5, -68.15];

function MarcadorCentral({ onGuardar }: { onGuardar: (c: L.LatLng) => void }) {
  const map = useMap();
  const guardarUbicacion = () => {
    const center = map.getCenter();
    onGuardar(center);
    alert(
      `Guardado: Lat ${center.lat.toFixed(6)}, Lng ${center.lng.toFixed(6)}`
    );
  };
  return (
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-[1000] flex w-full  justify-center">
      <button
        onClick={guardarUbicacion}
        className="mx-4 my-2 w-full md:w-sm rounded-2xl border border-bg2 bg-bg2 p-2 text-xl font-bold text-white flex"
      >
        <span className="flex-1">Guardar Ubicación</span>
        <ChevronRight className="h-8 w-8 text-white" />
      </button>
    </div>
  );
}

function ResponsiveSheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  children: React.ReactNode;
}) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    setIsDesktop(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className={
          isDesktop
            ? "hidden sm:flex h-full w-[350px] flex-col z-50 bg-white text-gray-800 rounded-l-2xl shadow-lg"
            : "sm:hidden h-[450px] flex w-full flex-col z-50 bg-white text-gray-800 rounded-t-2xl shadow-lg"
        }
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}

export default function HomePage() {
  const [elegirEnMapaDestino, setElegirEnMapaDestino] = useState(false);
  const [coordenadasDestino, setCoordenadasDestino] = useState<L.LatLng | null>(
    null
  );
  const cerrarDialogRef = useRef<HTMLButtonElement>(null);

  const [elegirEnMapaOrigen, setElegirEnMapaOrigen] = useState(false);
  const [coordenadasOrigen, setCoordenadasOrigen] = useState<L.LatLng | null>(
    null
  );
  const cerrarDialogOrigenRef = useRef<HTMLButtonElement>(null);

  const [lineasCercanas, setLineasCercanas] = useState<LineaCercana[]>([]);
  const [selectedLineaIndex, setSelectedLineaIndex] = useState(0);

  const [open, setOpen] = useState(false);
  const [headerSeccion, setHeaderSeccion] = useState(1);

  useEffect(() => {
    if (lineasCercanas.length > 0) {
      setSelectedLineaIndex(0);
    }
  }, [lineasCercanas]);

  const handleElegirDestino = () => {
    setElegirEnMapaDestino(true);
    setHeaderSeccion(2);
    cerrarDialogRef.current?.click();
  };

  const handleElegirOrigen = () => {
    setElegirEnMapaOrigen(true);
    setHeaderSeccion(2);
    cerrarDialogOrigenRef.current?.click();
  };

  const handleGuardarDestino = (coords: L.LatLng) => {
    setCoordenadasDestino(coords);
    setElegirEnMapaDestino(false);
    setHeaderSeccion(1);
  };

  const handleGuardarOrigen = (coords: L.LatLng) => {
    setCoordenadasOrigen(coords);
    setElegirEnMapaOrigen(false);
  };

  const handleCloseGuardar = () => {
    setElegirEnMapaDestino(false);
    setElegirEnMapaOrigen(false);
    setHeaderSeccion(1);
  };

  const handleClearUbicaciones = () => {
    setElegirEnMapaDestino(false);
    setElegirEnMapaOrigen(false);
    setCoordenadasDestino(null);
    setCoordenadasOrigen(null);
    setHeaderSeccion(1);
    setLineasCercanas([]);
  };

  const handleBuscarLineas = async () => {
    if (!coordenadasDestino) {
      alert("Primero seleccione el punto de destino en el mapa");
      return;
    }
    setOpen(true);
    setHeaderSeccion(3);
    try {
      const response = await fetchLineasCercanas(
        coordenadasDestino.lng,
        coordenadasDestino.lat
      );
      setLineasCercanas(response.data.lines);
    } catch (error) {
      console.error("Error al buscar líneas cercanas:", error);
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <style jsx global>{`
        .leaflet-top.leaflet-left {
          top: 4rem !important;
        }
      `}</style>
      <HeaderPage
        headerSeccion={headerSeccion}
        onClearUbicaciones={handleClearUbicaciones}
        onCloseGuardar={handleCloseGuardar}
        onBuscarLineas={handleBuscarLineas}
      />
      <div className="absolute bottom-0 left-0 w-full z-20">
        {headerSeccion === 1 && (
          <FooterPage
            /* setElegirEnMapaDestino={setElegirEnMapaDestino} */
            onElegirDestinoDesdeMapa={handleElegirDestino}
            cerrarDialogRef={cerrarDialogRef}
            /* setElegirEnMapaOrigen={setElegirEnMapaOrigen} */
            onElegirOrigenDesdeMapa={handleElegirOrigen}
            cerrarDialogOrigenRef={cerrarDialogOrigenRef}
            /* onClearUbicaciones={handleClearUbicaciones} */
            /* onBuscarLineas={handleBuscarLineas} */
          />
        )}
      </div>
      <MapContainer
        center={DEFAULT_POSITION}
        zoom={13}
        scrollWheelZoom
        zoomControl={false}
        className={`h-full w-full z-0 ${open ? "pointer-events-none" : ""}`}
      >
        <LayersControl position="topleft">
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
            positions={lineasCercanas[selectedLineaIndex].points.map(
              (p: Punto) => [p.lon, p.lat]
            )}
            pathOptions={{ weight: 8 }}
          />
        )}
        <ZoomControl position="topleft" />
      </MapContainer>
      <ResponsiveSheet open={open} onOpenChange={setOpen}>
        {/* Header con cierre */}
        <SheetHeader className="p-0">
          {/* Wrapper blanco con bordes redondeados y sombra */}
          <div className="relative m-4 rounded-2xl bg-white shadow-lg p-4">
            {/* Grid: columna de timeline + columna de texto */}
            <div className="grid grid-cols-[auto_1fr] gap-4 items-stretch">
              {/* Timeline: punto verde, línea y flecha */}
              <div className="flex flex-col items-center justify-between h-full py-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <div className="flex-1 w-px bg-gray-300 my-1"></div>
                <div className="w-px flex-1 bg-gray-300"></div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              {/* Textos */}
              <div>
                {/* Fila “Desde: Ruta actual” */}
                <div className="flex items-baseline">
                  <span className="text-purple-700 font-semibold">Desde:</span>
                  <span className="ml-1 text-gray-500">Ruta actual</span>
                </div>

                {/* Línea divisoria */}
                <hr className="border-t border-gray-200 my-2" />

                {/* Fila “A: Destino Seleccionado” */}
                <div>
                  <span className="text-gray-500">A: Destino Seleccionado</span>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Costo y Tiempo */}
        {/*<div className="flex justify-between px-6 mt-4">
          <div className="flex-1 bg-bg2 border border-green-200 rounded-lg py-2 mr-2 text-center">
            <div className="text-xs text-gray-500">Costo de Tarifa</div>
            <div className="mt-1 text-sm font-semibold text-white">
              Bs 2.40
            </div>
          </div>
          <div className="flex-1 bg-bg1 border border-blue-200 rounded-lg py-2 ml-2 text-center">
            <div className="text-xs text-gray-500">Tiempo Estimado</div>
            <div className="mt-1 text-sm font-semibold text-white">
              23 mins
            </div>
          </div>
        </div>*/}

        {/* Lista de Rutas Cercanas */}
        <div className="px-6 mt-6 flex-1 overflow-y-auto">
          <h3 className="text-sm font-medium text-black mb-2">
            Rutas Cercanas:
          </h3>
          {lineasCercanas.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              No se encontraron líneas
            </div>
          ) : (
            <div className="space-y-3">
              {lineasCercanas.map((linea, index) => (
                <div
                  key={linea._id || index}
                  className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Bus className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-bg1 font-medium">
                      Minibus {linea.number}
                    </span>
                  </div>
                  <Button
                    className="bg-blue-500 text-white py-1 px-4 rounded-full hover:bg-blue-600"
                    onClick={() => {
                      setSelectedLineaIndex(index);
                      console.log("linea", lineasCercanas[selectedLineaIndex]);
                    }}
                  >
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cerrar panel */}
        {/* <div className="px-6 pb-6 pt-4">
          <Button
            onClick={() => setOpen(false)}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200"
          >
            Cerrar panel
          </Button>
        </div> */}
      </ResponsiveSheet>
      {lineasCercanas.length > 0 && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center z-30">
          <div
            className="mx-4 mt-2 w-full md:w-sm rounded-2xl border border-bg2 text-xl bg-bg2 flex justify-between cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <div className="text-white p-2 font-bold bg-bg2 flex-1 text-center">
              Mostrar líneas
            </div>
            <ChevronRight className="h-8 w-8 text-xl text-white my-auto mr-1" />
          </div>
        </div>
      )}

      {(elegirEnMapaDestino || elegirEnMapaOrigen) && (
        <div className="absolute top-1/2 left-1/2 z-[500] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <Image
            src="/icons/icon-ubicacion.svg"
            alt="Ubicación"
            width={48}
            height={48}
            priority
          />
          {/* <img src="/icons/icon-ubicacion.svg" alt="ubicacion" /> */}
        </div>
      )}
    </div>
  );
}
