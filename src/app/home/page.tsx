"use client";
import "leaflet/dist/leaflet.css";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

import HeaderPage from "../../components/header";
import FooterPage from "@/components/footer";
import { fetchLineasCercanas } from "@/lib/endpoints";
import { LineaCercana } from "@/types/linea";
import ResponsiveSheet from "@/features/home/components/ResponsiveSheet";
import ShowLinesButton from "@/features/home/components/ShowLinesButton";
import CentralIcon from "@/features/home/components/CentralIcon";

// Cargamos MapSection **solo en cliente**, sin SSR
const MapSection = dynamic(
  () => import("@/features/home/components/MapSection"),
  { ssr: false }
);

export default function HomePage() {
  // parche de íconos Leaflet en cliente
  useEffect(() => {
    // nada de window en servidor
    import("leaflet").then((L) => {
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  // ===================== Estado =====================
  const [elegirEnMapaDestino, setElegirEnMapaDestino] = useState(false);
  const [coordenadasDestino, setCoordenadasDestino] =
    useState<L.LatLng | null>(null);
  const cerrarDialogRef = useRef<HTMLButtonElement>(null);

  const [elegirEnMapaOrigen, setElegirEnMapaOrigen] = useState(false);
  const [coordenadasOrigen, setCoordenadasOrigen] =
    useState<L.LatLng | null>(null);
  const cerrarDialogOrigenRef = useRef<HTMLButtonElement>(null);

  const [lineasCercanas, setLineasCercanas] = useState<LineaCercana[]>([]);
  const [selectedLineaIndex, setSelectedLineaIndex] = useState(0);

  const [open, setOpen] = useState(false);
  const [headerSeccion, setHeaderSeccion] = useState<1 | 2 | 3>(1);

  // Sincronizar índice
  useEffect(() => {
    if (lineasCercanas.length > 0) {
      setSelectedLineaIndex(0);
    }
  }, [lineasCercanas]);

  // Handlers UI
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
    setHeaderSeccion(1);
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

  // ==== Render ====
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
            onElegirDestinoDesdeMapa={handleElegirDestino}
            cerrarDialogRef={cerrarDialogRef}
            onElegirOrigenDesdeMapa={handleElegirOrigen}
            cerrarDialogOrigenRef={cerrarDialogOrigenRef}
          />
        )}
      </div>

      <MapSection
        elegirDestino={elegirEnMapaDestino}
        elegirOrigen={elegirEnMapaOrigen}
        coordenadasDestino={coordenadasDestino}
        coordenadasOrigen={coordenadasOrigen}
        lineasCercanas={lineasCercanas}
        selectedLineaIndex={selectedLineaIndex}
        onGuardarDestino={handleGuardarDestino}
        onGuardarOrigen={handleGuardarOrigen}
        mapDisabled={open}
      />

      <ResponsiveSheet
        open={open}
        onOpenChange={setOpen}
        lineasCercanas={lineasCercanas}
        selectedLineaIndex={selectedLineaIndex}
        setSelectedLineaIndex={setSelectedLineaIndex}
      />

      <ShowLinesButton
        visible={lineasCercanas.length > 0}
        onClick={() => setOpen(!open)}
      />

      <CentralIcon
        visible={elegirEnMapaDestino || elegirEnMapaOrigen}
      />
    </div>
  );
}
