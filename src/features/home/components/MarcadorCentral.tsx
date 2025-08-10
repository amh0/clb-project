"use client";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";

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
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-[1000] flex w-full justify-center px-2">
      <Button
        variant={"variant1"}
        onClick={guardarUbicacion}
        className="mx-4 my-2 w-full md:w-2xl flex rounded-full text-xl"
      >
        <span className="flex-1">Seleccionar Coordenada</span>
      </Button>
    </div>
  );
}
