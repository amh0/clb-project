import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Crosshair, MapPin } from "lucide-react";
import { useState } from "react";

interface PropsHeader {
  onElegirDestinoDesdeMapa: () => void;
  onElegirOrigenDesdeMapa: () => void;
  onSetCurrentLocationAsOrigin: () => void;
  onSetCurrentLocationAsDestination: () => void;
}

export default function FooterPage({
  onElegirDestinoDesdeMapa,
  onElegirOrigenDesdeMapa,
  onSetCurrentLocationAsOrigin,
  onSetCurrentLocationAsDestination,
}: PropsHeader) {
  const [origenOpen, setOrigenOpen] = useState(false);
  const [destinoOpen, setDestinoOpen] = useState(false);

  const handleOrigenCurrentLocation = () => {
    onSetCurrentLocationAsOrigin();
    setOrigenOpen(false);
  };

  const handleDestinoCurrentLocation = () => {
    onSetCurrentLocationAsDestination();
    setDestinoOpen(false);
  };

  const handleElegirOrigenMapa = () => {
    onElegirOrigenDesdeMapa();
    setOrigenOpen(false);
  };

  const handleElegirDestinoMapa = () => {
    onElegirDestinoDesdeMapa();
    setDestinoOpen(false);
  };

  return (
    <div className="flex">
      <div className="flex flex-col w-full">
        {/* Dialog de ORIGEN */}
        <div className="border-2 border-transparent">
          <Dialog open={origenOpen} onOpenChange={setOrigenOpen}>
            <div className="flex justify-center items-center md:justify-start border-2 border-transparent">
              <DialogTrigger asChild>
                <div className="mx-4 mt-2 w-full md:w-sm rounded-2xl border-1 border-bg1 text-xl bg-bg-light flex justify-between cursor-pointer">
                  <p className="text-white p-2 font-bold flex-1 text-center">
                    Seleccionar Origen
                  </p>
                </div>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-md bg-white text-black rounded-2xl p-6 z-[100] border-none">
              <DialogHeader>
                <DialogTitle className="text-start">
                  Seleccionar Origen
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-2">
                <div className="grid flex-1 gap-2 w-full">
                  <Input
                    type="text"
                    placeholder="Ingrese el nombre del origen"
                    className="w-full border border-[#14a292]text-gray-700 placeholder:text-gray-400 caret-[#14a292] focus-visible:outline-none focus-visible:border-[#14a292] focus-visible:ring-2 focus-visible:ring-[#14a292] focus-visible:ring-offset-2 hover:shadow-[0_0_0_2px_rgba(20,162,146,0.12)]"
                  />
                </div>
                <Button
                  variant="ghost"
                  className="w-full dark:text-white"
                  onClick={handleOrigenCurrentLocation}
                >
                  <Crosshair /> Su ubicación actual
                </Button>
                <Button
                  variant={"variant1"}
                  className="w-full"
                  onClick={handleElegirOrigenMapa}
                >
                  <MapPin /> Buscar en el mapa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dialog de DESTINO */}
        <div>
          <Dialog open={destinoOpen} onOpenChange={setDestinoOpen}>
            <div className="flex justify-center items-center md:justify-start">
              <DialogTrigger asChild>
                <div className="mx-4 my-2 w-full md:w-sm rounded-2xl border-1 border-bg1 text-xl bg-bg-light flex justify-between cursor-pointer">
                  <p className="text-white p-2 font-bold flex-1 text-center">
                    Seleccionar Destino
                  </p>
                </div>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-md text-black bg-white rounded-2xl p-6 z-[100] border-none">
              <DialogHeader>
                <DialogTitle className="text-start">
                  Seleccionar Destino
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-2">
                <div className="grid flex-1 gap-2 w-full">
                  <Input
                    type="text"
                    placeholder="Ingrese punto de Destino"
                    className="w-full border border-[#14a292]text-gray-700 placeholder:text-gray-400 caret-[#14a292] focus-visible:outline-none focus-visible:border-[#14a292] focus-visible:ring-2 focus-visible:ring-[#14a292] focus-visible:ring-offset-2 hover:shadow-[0_0_0_2px_rgba(20,162,146,0.12)]"
                  />
                </div>
                <Button
                  variant="ghost"
                  className="w-full dark:text-white"
                  onClick={handleDestinoCurrentLocation}
                >
                  <Crosshair /> Su ubicación actual
                </Button>
                <Button
                  variant="variant1"
                  className="w-full dark:text-white"
                  onClick={handleElegirDestinoMapa}
                >
                  <MapPin /> Buscar en el mapa
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
