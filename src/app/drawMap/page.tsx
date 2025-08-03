"use client"
import dynamic from 'next/dynamic'

const DrawMapClient = dynamic(() => import('@/components/DrawMapClient'), {
  ssr: false,
  loading: () => <p className="p-4">Cargando mapa…</p>,
})

export default function Page() {
  return <DrawMapClient />
}
