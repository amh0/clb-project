"use client";
import { ChevronRight } from "lucide-react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface MarcadorCentralProps {
  onGuardar: (coords: L.LatLng) => void;
}

export default function MarcadorCentral({ onGuardar }: MarcadorCentralProps) {
  const map = useMap();
  const guardarUbicacion = () => {
    const center = map.getCenter();
    onGuardar(center);
    // Notificación sencilla; se puede migrar a toast.
    alert(`Guardado: Lat ${center.lat.toFixed(6)}, Lng ${center.lng.toFixed(6)}`);
  };

  return (
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-[1000] flex w-full justify-center">
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
