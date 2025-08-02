"use client"

import Nadvar from "./nadvar";
import { Button } from "./ui/button";
import { ChevronLeft, Search, X } from "lucide-react";

interface Props {
  headerSeccion: number;
  onClearUbicaciones: () => void;
  onCloseGuardar: () => void;
  onBuscarLineas: () => void;
}

interface SyndicateRoute {
  _id: string;
  number: number;
  syndicate: string;
  points: Point[];
  vectorLine: VectorLine;
}

interface Point {
  lat: number;
  lon: number;
  type: 'Point';
  coordinates: [number, number];
  _id: string;
}

interface VectorLine {
  _id: string;
  vectorPoints: Array<{
    lat: number;
    lon: number;
  }>;
}

export default function HeaderPage(props: Props) {
  const { headerSeccion, onClearUbicaciones, onCloseGuardar, onBuscarLineas } =
    props;
  const handleEpmty = () => {
    onClearUbicaciones();
  };

  const renderHeader = () => {
    switch (headerSeccion) {
      case 1:
        // 🔹 Sección 1
        return (
          <>
            <div className="ml-2 mt-2">
              <Nadvar />
            </div>
            <div className="mx-auto mt-2 border-2 text-center text-xl font-bold rounded-3xl bg-white border-bg2 shadow-2xl p-2">
                ¿A donde quieres ir?
            </div>
            <Button
              variant="outline"
              className="mt-2 mr-2 bg-bg2 rounded-full hover:bg-green-600 cursor-pointer"
              onClick={onBuscarLineas}
            >
              <Search className="text-white " />
            </Button>
            {/* <Button
              variant="outline"
              className="my-2 mr-2 bg-variant6 hover:bg-variant6/80 cursor-pointer"
              onClick={handleEpmty}
            >
              <X className="text-white" />
            </Button> */}
          </>
        );

      case 2:
        // 🔹 Sección 2
        return (
          <div className="m-2 w-full text-2xl flex items-center justify-center font-bold relative">
            <Button
              onClick={() => onCloseGuardar()}
              className="bg-bg2 text-white text-xl cursor-pointer size-10 rounded-full left-0 absolute"
            >
              <ChevronLeft />
            </Button>
            Selecciona Destino
          </div>
        );

      case 3:
        // 🔹 Sección 3
        return (
          <div className="m-2 w-full text-2xl flex items-center justify-center font-bold relative">
            <Button
              onClick={handleEpmty}
              className="bg-bg2 text-white text-xl cursor-pointer size-10 rounded-full left-1 absolute"
            >
              <ChevronLeft />
            </Button>
            <div className="bg-bg2 text-white p-2 border-2 rounded-xl">
              minibus123
            </div>
          </div>
        );

      default:
        return null; // puedes mostrar un header por defecto si quieres
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full z-20 flex items-center">
      {renderHeader()}
    </div>
  );
}
