"use client";

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
        <div className="bg-[#14a292] text-white transition-all duration-200 hover:bg-[#108578] hover:shadow-lg cursor-pointer p-2  flex-1 text-center rounded-full">Mostrar líneas</div>
      </div>
    </div>
  );
}
