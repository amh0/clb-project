"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import NadvarPage from "@/components/nadvarPage"
import Nadvar from "@/components/nadvar"
import { Bus } from "lucide-react"

interface FareCard {
  id: string
  title: string
  price: string // formatea como "Bs. 2,40"
}

const normales: FareCard[] = [
  { id: "normal",    title: "Horario Normal",   price: "Bs. 2,40" },
  { id: "nocturno",  title: "Horario Nocturno", price: "Bs. 2,80" },
  { id: "tramo",     title: "Tramo Largo",      price: "Bs. 3,50" },
]

const preferenciales: FareCard[] = [
  { id: "adulto",    title: "Adulto Mayor",     price: "Bs. 2,00" },
  { id: "escolar",   title: "Estudiantil",      price: "Bs. 1,50" },
]

export default function TransportFares() {
  const [selectedId, setSelectedId] = useState<string | null>("normal")

  const renderItem = (fare: FareCard) => {
    const isSelected = selectedId === fare.id

    return (
      <Card
        key={fare.id}
        onClick={() => setSelectedId(fare.id)}
        className={[
          "cursor-pointer bg-white border border-gray-200 rounded-xl shadow-md",
          "transition-all duration-200 hover:shadow-xl hover:scale-[1.01]",
          // estado seleccionado: contorno azul elegante
          isSelected ? "ring-2 ring-bg-light" : "ring-0"
        ].join(" ")}
      >
        <CardContent className="px-3">
          <div className="flex items-center justify-between gap-3">
            {/* izquierda: icono + título */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-[#14a292]/15 flex items-center justify-center shrink-0">
                <Bus className="h-5 w-5 text-[#14a292]" />
              </div>
              <span className="text-[15px] sm:text-base font-medium text-gray-800 truncate">
                {fare.title}
              </span>
            </div>

            {/* derecha: chip de precio */}
            <span
              className={[
                "inline-flex items-center justify-center",
                "rounded-full px-3 py-1 text-[13px] font-semibold shrink-0",
                "shadow-sm",
                // verde principal con contraste adecuado
                "bg-[#14a292] text-white"
              ].join(" ")}
            >
              {fare.price}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NadvarPage title="Tarifas de Transporte" left={<Nadvar />} />

      {/* Contenedor con borde verde como en el mock */}
      <div className="mx-4 sm:mx-8 mt-3 mb-8">
        <div className="bg-white rounded-2xl border-2 border-[#14a292] p-3">
          {/* caja interna para la lista (borde sutil y radios grandes como en la imagen) */}
          <div className="p-3">
            {/* Lista */}
            <div className="space-y-3">
              {normales.map(renderItem)}

              {/* Subtítulo sección preferenciales */}
              <div className="px-1 pt-1 text-2xl font-bold sm:text-sm text-gray-600">
                Tarifas Preferenciales
              </div>

              {preferenciales.map(renderItem)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
