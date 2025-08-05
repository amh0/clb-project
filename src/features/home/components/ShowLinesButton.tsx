"use client";
import { ChevronRight } from "lucide-react";

interface ShowLinesButtonProps {
  visible: boolean;
  onClick: () => void;
}

export default function ShowLinesButton({ visible, onClick }: ShowLinesButtonProps) {
  if (!visible) return null;
  return (
    <div className="absolute inset-x-0 bottom-2 flex justify-center z-30">
      <div
        className="mx-4 mt-2 w-full md:w-sm rounded-2xl border border-bg2 text-xl bg-bg2 flex justify-between cursor-pointer"
        onClick={onClick}
      >
        <div className="text-white p-2 font-bold bg-bg2 flex-1 text-center">Mostrar líneas</div>
        <ChevronRight className="h-8 w-8 text-xl text-white my-auto mr-1" />
      </div>
    </div>
  );
}
