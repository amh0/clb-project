'use client'

import { useState, useEffect, useRef } from 'react'
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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  House,
  MapPin,
  Route as RouteIcon,
  Upload,
  Copy,
  Eraser,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'

import { useRouteDraftStore } from '@/stores/routeDraftStore'

// Utilidades
function dedupeConsecutive(points: [number, number][]) {
  const out: [number, number][] = []
  for (const p of points) {
    const last = out[out.length - 1]
    if (!last || Math.abs(last[0] - p[0]) > 1e-9 || Math.abs(last[1] - p[1]) > 1e-9) {
      out.push(p)
    }
  }
  return out
}
function round6(n: number) {
  return Math.round(n * 1e6) / 1e6
}

function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

const smallIcon = L.divIcon({
  html: '<div style="background-color:#0e6e60;width:12px;height:12px;border-radius:50%;border:2px solid white;"></div>',
  iconSize: [12, 12],
  className: '',
})

export default function DrawMapClient() {
  const router = useRouter()
  const setDraftPoints = useRouteDraftStore((s) => s.setPoints)

  // estado UI
  const [activeTab, setActiveTab] = useState<'entrada' | 'coords'>('entrada')
  const [isLoading, setIsLoading] = useState(false)

  // estado datos
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

  // ref mapa para fitBounds
  const mapRef = useRef<L.Map | null>(null)

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
    if (!rawCoordinates.length) {
      alert('No hay coordenadas válidas ([lon, lat]).')
      return
    }

    setIsLoading(true)
    const chunks: [number, number][][] = []
    for (let i = 0; i < rawCoordinates.length; i += 100) {
      chunks.push(rawCoordinates.slice(i, i + 100))
    }
    const newCoords: [number, number][] = []

    try {
      for (const chunk of chunks) {
        const coordStr = chunk.map(([lon, lat]) => `${lon},${lat}`).join(';')
        const radiuses = chunk.map(() => 100).join(';')
        const res = await axios.get(
          `https://router.project-osrm.org/match/v1/driving/${coordStr}?geometries=geojson&overview=full&radiuses=${radiuses}`
        )
        const matched: [number, number][] =
          res.data.matchings?.[0]?.geometry?.coordinates.map(
            ([lon, lat]: [number, number]) => [lat, lon]
          ) || []
        newCoords.push(...matched)
      }
      const cleaned = dedupeConsecutive(newCoords)
      setRuta(cleaned)

      // encuadre completo
      if (mapRef.current && cleaned.length) {
        const bounds = L.latLngBounds(cleaned as [number, number][])
        mapRef.current.fitBounds(bounds, { padding: [24, 24] })
      }

      // cambia a pestaña de coordenadas para ver resultado
      setActiveTab('coords')
    } catch (error) {
      console.error('Error OSRM match:', error)
      alert('Hubo un problema al generar la ruta con OSRM.')
    } finally {
      setIsLoading(false)
    }
  }

  const center: [number, number] = ruta.length > 0 ? ruta[0] : [-16.5, -68.15] // La Paz aprox

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

  // Panel de coordenadas: mostramos REALES { lon, lat } (ruta es [lat, lon])
  const labeledCoords = ruta.map(([lat, lon]) => ({ lon, lat }))

  const copiarJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(labeledCoords, null, 2))
      alert('Coordenadas copiadas al portapapeles.')
    } catch {
      alert('No se pudo copiar el JSON.')
    }
  }

  // Enviar al dashboard (formato backend invertido)
  const enviarAlDashboard = () => {
    if (!ruta || ruta.length < 2) {
      alert('Primero genera o edita una ruta con al menos 2 puntos.')
      return
    }
    const cleaned = dedupeConsecutive(ruta)
    const backendPoints = cleaned.map(([lat, lon]) => ({
      lat: round6(lon), // lat ← valor real de latitud (~ -16)
      lon: round6(lat), // lon ← valor real de longitud (~ -68)
    }))
    setDraftPoints(backendPoints)
    router.push('/dashboard/lines')
  }

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4 p-4 md:p-6">
      {/* Columna izquierda: mapa */}
      <Card className="rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <RouteIcon className="h-5 w-5" />
            Ajuste y edición de ruta
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link href="/home">
              <Button variant="outline" className="gap-2">
                <House className="h-4 w-4" />
                Inicio
              </Button>
            </Link>

            <Button
              variant="outline"
              className="gap-2"
              onClick={generarRuta}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generando…
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  Generar ruta
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowMarkers((prev) => !prev)}
            >
              {showMarkers ? 'Ocultar marcadores' : 'Mostrar marcadores'}
            </Button>

            <Button
              className="gap-2 text-white"
              style={{ background: 'var(--color-bg-light)' }}
              onClick={enviarAlDashboard}
              title="Ir al panel para guardar esta línea"
            >
              <Upload className="h-4 w-4" />
              Enviar al dashboard
            </Button>

            <Button variant="outline" className="gap-2" onClick={() => setRuta([])}>
              <Eraser className="h-4 w-4" />
              Limpiar ruta
            </Button>
          </div>

          {/* Mapa con overlay de carga */}
          <div className="relative h-[62vh] w-full rounded-xl overflow-hidden border">
            <MapContainer
              center={ruta.length ? [ruta[0][0], ruta[0][1]] : [-16.5, -68.15]}
              zoom={15}
              scrollWheelZoom
              minZoom={2}
              maxZoom={22}
              className="w-full h-full"
              whenCreated={(m) => (mapRef.current = m)}
            >
              <ChangeMapView center={ruta.length ? ruta[0] : [-16.5, -68.15]} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxNativeZoom={19}
                maxZoom={22}
              />
              {ruta.length > 0 && (
                <Polyline
                  positions={ruta}
                  eventHandlers={{ click: handleLineClick }}
                  pathOptions={{ color: '#14a292', weight: 6, opacity: 0.9 }}
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

            {isLoading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Generando ruta con OSRM…</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Columna derecha: Tabs Entrada/Coordenadas */}
      <div className="space-y-4 lg:sticky lg:top-4 self-start">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Panel de datos</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="mb-3">
                <TabsTrigger value="entrada">Entrada</TabsTrigger>
                <TabsTrigger value="coords">Coordenadas</TabsTrigger>
              </TabsList>

              <TabsContent value="entrada" className="space-y-2">
                <Label className="text-sm">Coordenadas de entrada (lon, lat)</Label>
                <Textarea
                  className="w-full font-mono text-xs h-56" // altura fija con scroll interno
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder='[-68.12, -16.50],\n[-68.12, -16.50], ...'
                />
                <p className="text-xs text-muted-foreground">
                  Formato: pares <strong>[lon, lat]</strong> separados por coma y salto de línea.
                </p>
              </TabsContent>

              <TabsContent value="coords" className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2" onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(JSON.stringify(labeledCoords, null, 2))
                      alert('Coordenadas copiadas al portapapeles.')
                    } catch {
                      alert('No se pudo copiar el JSON.')
                    }
                  }}>
                    <Copy className="h-4 w-4" /> Copiar JSON
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {labeledCoords.length} puntos
                  </span>
                </div>
                <pre className="text-xs bg-gray-50 p-3 rounded-xl overflow-auto max-h-[38vh] border font-mono">
{JSON.stringify(labeledCoords, null, 2)}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
