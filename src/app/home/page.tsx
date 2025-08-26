"use client";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useMapStore } from "@/stores/useMapStore";

import HeaderPage from "../../components/header";
import FooterPage from "@/components/footer";
import ResponsiveSheet from "@/features/home/components/ResponsiveSheet";
import ShowLinesButton from "@/features/home/components/ShowLinesButton";
import CentralIcon from "@/features/home/components/CentralIcon";

import { initializeLeafletIcons } from "@/lib/utils";

// Cargamos MapSection **solo en cliente**, sin SSR
const MapSection = dynamic(
  () => import("@/features/home/components/MapSection"),
  { ssr: false }
);

export default function HomePage() {
  const {
    elegirEnMapaDestino,
    elegirEnMapaOrigen,
    coordenadasDestino,
    coordenadasOrigen,
    lineasCercanas,
    selectedLineaIndex,
    isSheetOpen,
    headerSeccion,
    startElegirDestino,
    startElegirOrigen,
    setCoordenadasDestino,
    setCoordenadasOrigen,
    handleSetCurrentLocation,
    stopElegirUbicacion,
    clearUbicaciones,
    buscarLineasCercanas,
    setIsSheetOpen,
    setSelectedLineaIndex,
  } = useMapStore();

  useEffect(() => {
    initializeLeafletIcons();
  }, []);

  // Sincronizar índice
  useEffect(() => {
    if (lineasCercanas.length > 0) {
      setSelectedLineaIndex(0);
    }
  }, [lineasCercanas, setSelectedLineaIndex]);

  // ==== Render ====
  return (
    <div className="relative h-screen w-screen">
      <style jsx global>{`
        .leaflet-top.leaflet-right {
          top: 4rem !important;
          right: 1rem !important;
        }
      `}</style>

      <HeaderPage
        headerSeccion={headerSeccion}
        onClearUbicaciones={clearUbicaciones}
        onCloseGuardar={stopElegirUbicacion}
        onBuscarLineas={buscarLineasCercanas}
      />

      <div className="absolute bottom-0 left-0 w-full z-20 lg:top-[60px] lg:bottom-auto ">
        {headerSeccion === 1 && (
          <FooterPage
            onElegirDestinoDesdeMapa={startElegirDestino}
            onElegirOrigenDesdeMapa={startElegirOrigen}
            onSetCurrentLocationAsOrigin={() => handleSetCurrentLocation('origen')}
            onSetCurrentLocationAsDestination={() => handleSetCurrentLocation('destino')}
            onGuardarOrigen={setCoordenadasOrigen}
            onGuardarDestino={setCoordenadasDestino}
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
        onGuardarDestino={setCoordenadasDestino}
        onGuardarOrigen={setCoordenadasOrigen}
        mapDisabled={isSheetOpen}
      />

      <ResponsiveSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        lineasCercanas={lineasCercanas}
        selectedLineaIndex={selectedLineaIndex}
        setSelectedLineaIndex={setSelectedLineaIndex}
      />

      <ShowLinesButton
        visible={lineasCercanas.length > 0}
        onClick={() => setIsSheetOpen(!isSheetOpen)}
      />

      <CentralIcon
        visible={elegirEnMapaDestino || elegirEnMapaOrigen}
      />
    </div>
  );
}
