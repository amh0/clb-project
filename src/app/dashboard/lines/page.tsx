// src/app/dashboard/lines/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useRouteDraftStore } from '@/stores/routeDraftStore';
import { createLinea } from '@/lib/endpoints';

// shadcn/ui (ajusta rutas si tus componentes viven en otra carpeta)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

// Leaflet en cliente
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
import type { LatLngExpression, Map } from 'leaflet';
import L from 'leaflet';

/**
 * Recordatorio de convención BACKEND actual:
 * - Cada punto es { lat: number; lon: number } donde:
 *   - campo "lat" contiene en realidad la LONGITUD real (≈ -68)
 *   - campo "lon" contiene en realidad la LATITUD real (≈ -16)
 *
 * Para el mapa (Leaflet) necesitamos [latReal, lonReal] => [p.lon, p.lat]
 */

interface LineaPayload {
  number: string;
  syndicate?: string;
  points: { lat: number; lon: number }[];
}

export default function LinesDashboardPage() {
  const router = useRouter();
  const { points, clear } = useRouteDraftStore();
  const [number, setNumber] = useState('');
  const [syndicate, setSyndicate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Construir posiciones para el preview del mapa
  const positions = useMemo<LatLngExpression[]>(
    () => points.map(p => [p.lon, p.lat] as [number, number]),
    [points]
  );

  // Fit bounds al cargar/tener puntos
  const mapRef = useRef<Map>(null);
  useEffect(() => {
    if (mapRef.current && positions.length) {
      const bounds = L.latLngBounds(positions as [number, number][]);
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [positions]);

  const canSave = number.trim().length > 0 && points.length >= 2;

  async function onSave() {
    if (!canSave) {
      setMsg('Completa el número de línea y asegúrate de tener al menos 2 puntos.');
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const payload: LineaPayload = {
        number: number.trim(),
        syndicate: syndicate.trim() || undefined,
        points, // ya están en formato backend { lat: lonReal, lon: latReal }
      };

      await createLinea(payload);
      setMsg('✅ Línea creada correctamente.');
      clear();
      // router.push('/lines'); // Opcional: ir al mapa general para verla
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'desconocido';
      setMsg(`❌ Error al crear la línea: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard de Líneas</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/drawMap')}>
            ← Volver a DrawMap
          </Button>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {/* Columna izquierda: formulario */}
        <Card className="md:col-span-2 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Crear nueva línea</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="number">Número de línea</Label>
                <Input
                  id="number"
                  placeholder="Ej: 8"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="syndicate">Sindicato (opcional)</Label>
                <Input
                  id="syndicate"
                  placeholder="Ej: SIND. 1ro de Mayo"
                  value={syndicate}
                  onChange={(e) => setSyndicate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notas internas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Comentarios o referencias de esta línea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Separator />

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={onSave}
                disabled={!canSave || saving}
                className="bg-[var(--color-bg-light)] hover:opacity-90 text-white"
              >
                {saving ? 'Guardando…' : 'Guardar línea'}
              </Button>
              <Button variant="outline" onClick={() => clear()}>
                Limpiar puntos
              </Button>
              <span className="text-sm text-muted-foreground">
                {points.length} puntos listos
              </span>
            </div>

            {msg && (
              <p className="text-sm mt-1">
                {msg}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Columna derecha: preview JSON y mapa */}
        <div className="space-y-4">
          <Card className="shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Vista previa (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-50 p-3 rounded-xl overflow-auto max-h-[360px] border">
{JSON.stringify(points, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card className="shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Vista previa (Mapa)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full rounded-xl overflow-hidden border">
                {positions.length ? (
                  <MapContainer
                    ref={mapRef}
                    center={positions[0] as [number, number]}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polyline positions={positions} weight={5} opacity={0.85} />
                    {/* Marcadores opcionales: inicio/fin */}
                    <Marker position={positions[0] as [number, number]} />
                    <Marker position={positions[positions.length - 1] as [number, number]} />
                  </MapContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                    No hay puntos para previsualizar.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer simple */}
      <div className="text-xs text-muted-foreground">
        Consejo: Antes de guardar, verifica que la forma y el recorrido sean correctos. Puedes volver a <button className="underline" onClick={() => router.push('/drawMap')}>DrawMap</button> para ajustar.
      </div>
    </div>
  );
}
