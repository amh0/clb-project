"use client";

import Nadvar from "./nadvar";
import { Button } from "./ui/button";
import { ChevronLeft, Search } from "lucide-react";

interface Props {
  headerSeccion: number;
  onClearUbicaciones: () => void;
  onCloseGuardar: () => void;
  onBuscarLineas: () => void;
}

export default function HeaderPage(props: Props) {
  const { headerSeccion, onClearUbicaciones, onCloseGuardar, onBuscarLineas } =
    props;

  // 🔁 clases reutilizables para la barra
  const BAR =
    "bg-bg-light w-full grid grid-cols-[auto_1fr_auto] items-center rounded-b-2xl " +
    "px-2 py-2 shadow-sm";
  const TITLE = "mx-auto text-center text-white text-xl font-bold px-2";
  const ICON_BTN =
    "bg-bg2 text-white size-10 rounded-full hover:bg-[#108578] cursor-pointer";
  const RIGHT_PLACEHOLDER = "w-10 h-10 mr-2"; // mismo tamaño que el botón derecho

  const handleEpmty = () => onClearUbicaciones();

  const renderHeader = () => {
    switch (headerSeccion) {
      case 1: {
        // 🔹 Sección 1 (referencia)
        return (
          <div className={BAR}>
            {/* Izquierda: navbar */}
            <div className="pl-2">
              <Nadvar />
            </div>

            {/* Centro: título */}
            <div className={TITLE}>¿A dónde quieres ir?</div>

            {/* Derecha: botón buscar */}
            <div className="pr-2">
              <Button
                variant="outline"
                className={`${ICON_BTN} my-0 mr-0 bg-bg2`}
                onClick={onBuscarLineas}
                aria-label="Buscar líneas"
              >
                <Search />
              </Button>
            </div>
          </div>
        );
      }

      case 2: {
        // 🔹 Sección 2 — mismo estilo de barra que el caso 1
        return (
          <div className={BAR}>
            {/* Izquierda: botón back */}
            <div className="pl-2">
              <Button
                variant={"outline"}
                onClick={onCloseGuardar}
                className={ICON_BTN}
                aria-label="Volver"
              >
                <ChevronLeft />
              </Button>
            </div>

            {/* Centro: título */}
            <div className={TITLE}>Selecciona Destino</div>

            {/* Derecha: placeholder para mantener centrado el título */}
            <div className={RIGHT_PLACEHOLDER} />
          </div>
        );
      }

      case 3: {
        // 🔹 Sección 3 — mismo estilo de barra que el caso 1
        return (
          <div className={BAR}>
            {/* Izquierda: botón back (limpia) */}
            <div className="pl-2">
              <Button
                variant={"outline"}
                onClick={handleEpmty}
                className={ICON_BTN}
                aria-label="Volver"
              >
                <ChevronLeft />
              </Button>
            </div>

            {/* Centro: puedes usar texto o una “pill” */}
            <div className={TITLE}>Rutas Cercanas</div>

            {/* Derecha: placeholder para mantener centrado el contenido */}
            <div className={RIGHT_PLACEHOLDER} />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full z-20">{renderHeader()}</div>
  );
}
