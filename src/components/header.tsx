import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Crosshair, MapPin, Menu, Search, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ModeToggle } from "./mode-toggle";
import Nadvar from "./nadvar";

export default function HeaderPage({
  setElegirEnMapaDestino,
  onElegirDestinoDesdeMapa,
  cerrarDialogRef,
  setElegirEnMapaOrigen,
  onElegirOrigenDesdeMapa,
  cerrarDialogOrigenRef,
  onClearUbicaciones,
  onBuscarLineas,
}) {
  const handleEpmty = () => {
    onClearUbicaciones();
  };

  return (
    <div className="flex border-4 border-transparent">
      <div className="ml-2 mt-2 border-transparent border-2">
        <Nadvar/>
      </div>

      <div className="flex flex-col w-full">
        {/* Dialog de ORIGEN */}
        <div className="border-2 border-transparent">
          <Dialog>
            <div className="flex justify-center items-center md:justify-start border-2 border-transparent">
              <DialogTrigger asChild>
                <Input
                  type="text"
                  placeholder="Selecciona Origen"
                  className="mx-4 mt-2 w-full md:w-sm bg-white text-variant1 placeholder:text-variant1 border-variant1"
                />
              </DialogTrigger>
              <Button
                variant="outline"
                className="mt-2 mr-2 bg-variant1 hover:bg-variant2 cursor-pointer"
                onClick={onBuscarLineas}
              >
                <Search className="text-white " />
              </Button>
            </div>
            <DialogContent className="sm:max-w-md text-white bg-variant1 rounded-2xl p-6 z-[100] border-none">
              <DialogHeader>
                <DialogTitle className="text-start">Punto de Origen</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-2">
                <div className="grid flex-1 gap-2 w-full">
                  <Input
                    type="text"
                    placeholder="Ingrese punto de origen"
                    className="w-full"
                  />
                </div>
                <Button variant="ghost" className="w-full dark:text-white">
                  <Crosshair /> Su ubicación
                </Button>
                <Button
                  variant="ghost"
                  className="w-full dark:text-white"
                  onClick={onElegirOrigenDesdeMapa}
                >
                  <MapPin /> Elegir en el mapa
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    ref={cerrarDialogOrigenRef}
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dialog de DESTINO */}
        <div>
          <Dialog>
            <div className="flex justify-center items-center md:justify-start">
              <DialogTrigger asChild>
                <Input
                  type="text"
                  placeholder="Selecciona Destino"
                  className="mx-4 mt-2 w-full md:w-sm bg-white text-back placeholder:text-variant1 border-variant1"
                />
              </DialogTrigger>
              <Button
                variant="outline"
                className="mt-2 mr-2 bg-variant6 hover:bg-variant6/80 cursor-pointer"
                onClick={handleEpmty}
              >
                <X className="text-white" />
              </Button>
            </div>
            <DialogContent className="sm:max-w-md text-white bg-variant1 rounded-2xl p-6 z-[100] border-none">
              <DialogHeader>
                <DialogTitle className="text-start">Punto de Destino</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-2">
                <div className="grid flex-1 gap-2 w-full">
                  <Input
                    type="text"
                    placeholder="Ingrese punto de Destino"
                    className="w-full"
                  />
                </div>
                <Button variant="ghost" className="w-full dark:text-white">
                  <Crosshair /> Su ubicación
                </Button>
                <Button
                  variant="ghost"
                  className="w-full dark:text-white"
                  onClick={onElegirDestinoDesdeMapa}
                >
                  <MapPin /> Elegir en el mapa
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    className="bg-white"
                    ref={cerrarDialogRef}
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
