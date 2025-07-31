import Nadvar from "./nadvar";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

interface Props {
  headerSeccion: number;
  onClearUbicaciones: () => void,
  onCloseGuardar: () => void,
}

export default function HeaderPage(props: Props) {
  const { headerSeccion, onClearUbicaciones, onCloseGuardar} = props;
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
            <div className="m-2 flex-1 border-2 text-center text-2xl font-bold">
              ¿A donde quieres ir?
            </div>
          </>
        );

      case 2:
        // 🔹 Sección 2
        return (
          <div className="m-2 w-full text-2xl flex items-center justify-center font-bold relative">
            <Button onClick={() => onCloseGuardar()} className="bg-bg2 text-white text-xl cursor-pointer size-10 rounded-full left-0 absolute">
              <ChevronLeft />
            </Button>
            Selecciona Destino
          </div>
        );

      case 3:
        // 🔹 Sección 3
        return (
          <div className="m-2 w-full border-8 border-amber-600 text-2xl flex items-center justify-center font-bold relative">
            <Button
              onClick={handleEpmty}
              className="bg-bg2 text-white text-xl cursor-pointer size-10 rounded-full left-1 absolute"
            >
              <ChevronLeft />
            </Button>
            <div className="bg-bg2 text-white p-2 border-2 rounded-xl">
              minibus234
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
