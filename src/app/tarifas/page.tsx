"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import NadvarPage from "@/components/nadvarPage"
import Nadvar from "@/components/nadvar"

interface FareCard {
  id: string
  title: string
  price: string
  date: string
}

const fareData: FareCard[] = [
  { id: "normal", title: "Horario Normal", price: "2.40 Bs", date: "22 OCT, 2022" },
  { id: "nocturno", title: "Horario Nocturno", price: "2.80 Bs", date: "22 MAR, 2022" },
  { id: "escolares", title: "Escolares", price: "1.50 Bs", date: "15 NOV, 2022" },
  { id: "adultos", title: "Adultos Mayores", price: "2 Bs", date: "15 DIC, 2022" },
  { id: "tramo", title: "Tramo Largo", price: "3.50 Bs", date: "17 ENE, 2024" },
]

export default function TransportFares() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <NadvarPage title="Tarifas de transporte">
        <Nadvar />
      </NadvarPage>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Layout responsivo con grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
          {fareData.map((fare) => {
            const isSelected = fare.id === selectedId
            return (
              <Card
                key={fare.id}
                onClick={() => setSelectedId(fare.id)}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
                  isSelected
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white border-green-200 hover:border-green-300"
                }`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex justify-between items-start sm:items-center">
                    <div className="flex-1">
                      <h3 className={`font-medium text-base sm:text-lg lg:text-xl ${isSelected ? "text-white" : "text-gray-900"}`}>
                        {fare.title}
                      </h3>
                      <p className={`text-sm mt-1 sm:mt-2 ${isSelected ? "text-green-100" : "text-gray-500"}`}>
                        Actualizado: {fare.date}
                      </p>
                    </div>
                    <div className={`font-bold text-lg sm:text-xl lg:text-2xl text-right ${isSelected ? "text-white" : "text-green-600"}`}>
                      {fare.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-white rounded-lg border border-green-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h2>
          <div className="grid gap-4 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Tarifas vigentes desde enero 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Descuentos aplicables con tarjeta estudiantil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Adultos mayores requieren credencial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
