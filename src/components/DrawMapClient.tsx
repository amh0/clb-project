'use client'

import { useState, useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet'
import L, { LeafletEvent, LeafletMouseEvent } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { House } from 'lucide-react'

function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

const smallIcon = L.divIcon({
  html: '<div style="background-color:#1976d2;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>',
  iconSize: [12, 12],
  className: '',
})

export default function DrawMapClient() {
  const [inputText, setInputText] = useState<string>(
    `[-68.12592215944674, -16.504475034789223],
[-68.12561582840164, -16.504636908682414],
[-68.12546092236255, -16.504975675257455],
[-68.12521394623536, -16.505517778114097],
[-68.12486932380708, -16.505849867979435],
[-68.12432791761805, -16.50625441925702],
[-68.12380784174273, -16.506704314811927],
[-68.1233968156372, -16.50716660990426],
[-68.12303890803125, -16.507849799571133],
[-68.1228259353856, -16.508230258574102]`
  )

  const [ruta, setRuta] = useState<[number, number][]>([])
  const [showMarkers, setShowMarkers] = useState(true)

  const parseInput = (): [number, number][] => {
    try {
      const json = `[${inputText}]`
      const arr = JSON.parse(json)
      return arr.map((v: [number, number]) => [v[0], v[1]])
    } catch (e) {
      console.error('Error al parsear coordenadas:', e)
      return []
    }
  }

  const generarRuta = async () => {
    const rawCoordinates = parseInput()
    const chunks: [number, number][][] = []
    for (let i = 0; i < rawCoordinates.length; i += 100) {
      chunks.push(rawCoordinates.slice(i, i + 100))
    }
    const newCoords: [number, number][] = []
    for (const chunk of chunks) {
      const coordStr = chunk.map(([lon, lat]) => `${lon},${lat}`).join(';')
      const radiuses = chunk.map(() => 100).join(';')
      try {
        const res = await axios.get(
          `https://router.project-osrm.org/match/v1/driving/${coordStr}?geometries=geojson&overview=full&radiuses=${radiuses}`
        )
        const matched: [number, number][] =
          res.data.matchings?.[0]?.geometry?.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon]
          ) || []
        newCoords.push(...matched)
      } catch (error) {
        console.error('Error OSRM match:', error)
      }
    }
    setRuta(newCoords)
  }

  const center: [number, number] = ruta.length > 0 ? ruta[0] : [0, 0]

  const handleLineClick = (e: LeafletMouseEvent) => {
    const { lat, lng } = e.latlng
    const clickPoint = L.latLng(lat, lng)
    let bestIdx = 0
    let bestDiff = Infinity
    ruta.forEach((pt, i) => {
      if (i === ruta.length - 1) return
      const p1 = L.latLng(ruta[i][0], ruta[i][1])
      const p2 = L.latLng(ruta[i + 1][0], ruta[i + 1][1])
      const diff =
        p1.distanceTo(clickPoint) + p2.distanceTo(clickPoint) - p1.distanceTo(p2)
      if (diff < bestDiff) {
        bestDiff = diff
        bestIdx = i
      }
    })
    setRuta((prev) => {
      const copy = [...prev]
      copy.splice(bestIdx + 1, 0, [lat, lng])
      return copy
    })
  }

  const handleDragEnd = (index: number, e: LeafletEvent) => {
    const { lat, lng } = (e.target as L.Marker).getLatLng()
    setRuta((prev) => {
      const copy = [...prev]
      copy[index] = [lat, lng]
      return copy
    })
  }

  const handleRemove = (index: number) => {
    setRuta((prev) => prev.filter((_, i) => i !== index))
  }

  const labeledCoords = ruta.map(([lon, lat]) => ({ lat, lon }))

  return (
    <div className="w-full h-screen flex">
      <div className="flex-1 flex flex-col">
        <div className="p-4 flex flex-col gap-2">
          <label className="font-bold">Coordenadas de entrada:</label>
          <textarea
            rows={6}
            className="w-full p-2 border rounded text-sm font-mono"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex gap-2">
            <Link href="/home">
              <Button className="cursor-pointer" variant="outline">
                <House />
              </Button>
            </Link>
            <Button onClick={generarRuta} variant="outline">
              Generar ruta
            </Button>
            <Button
              onClick={() => setShowMarkers((prev) => !prev)}
              variant="outline"
            >
              {showMarkers ? 'Ocultar marcadores' : 'Mostrar marcadores'}
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <MapContainer
            center={[center[0], center[1]]}
            zoom={15}
            scrollWheelZoom
            minZoom={2}
            maxZoom={22}
            className="w-full h-full"
          >
            <ChangeMapView center={center} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxNativeZoom={19}
              maxZoom={22}
            />
            {ruta.length > 0 && (
              <Polyline
                positions={ruta}
                eventHandlers={{ click: handleLineClick }}
                pathOptions={{ color: 'blue', weight: 8 }}
              />
            )}
            {showMarkers &&
              ruta.map((pos, idx) => (
                <Marker
                  key={idx}
                  position={pos}
                  icon={smallIcon}
                  draggable
                  eventHandlers={{
                    dragend: (e) => handleDragEnd(idx, e),
                  }}
                >
                  <Popup>
                    <div className="flex flex-col">
                      <span>Punto {idx + 1}</span>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>

      {/* Right panel: coordinates */}
      <div className="w-1/3 p-4 overflow-auto bg-gray-100 text-sm font-mono">
        <h2 className="font-bold mb-2">Coordenadas editables:</h2>
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(labeledCoords, null, 2)}
        </pre>
      </div>
    </div>
  )
}
