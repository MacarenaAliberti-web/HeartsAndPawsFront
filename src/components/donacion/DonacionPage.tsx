'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Mascota } from '@/types/mascotas'
import { Caso } from '@/types/casos'
import {
  getMascotasEnDonacion,
  getMascotasDonacionFiltradas,
} from '@/services/mascotas'
import MascotaCard from '@/components/adopcion/MascotaCard'
import MascotaModal from '@/components/adopcion/MascotaModal'

export default function DonacionPage() {
  const router = useRouter()

  // Estados para filtro y orden
  const [tipo, setTipo] = useState<'perro' | 'gato' | ''>('')
  const [orden, setOrden] = useState<'mas_reciente' | 'mas_antiguo'>('mas_reciente')

  const [resultados, setResultados] = useState<Caso[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null)
  const [mostrandoHistoria, setMostrandoHistoria] = useState(false)

  // Función para cargar mascotas con filtros
  const fetchMascotas = useCallback(async (filtros: { tipo?: string }) => {
    setCargando(true)
    setError('')
    try {
      const data =
        Object.keys(filtros).length === 0
          ? await getMascotasEnDonacion()
          : await getMascotasDonacionFiltradas(filtros)
console.log('🐾 Resultados filtrados:', data) // <-- agregá esto
      setResultados(data)
    } catch {
      setError('Hubo un error al cargar los casos de donación.')
      setResultados([])
    } finally {
      setCargando(false)
    }
  }, [])

  // Llamar fetch cuando cambian filtros
  useEffect(() => {
    fetchMascotas(tipo ? { tipo } : {})
  }, [tipo, fetchMascotas])

  // Ordenar resultados antes de mostrar
  const resultadosOrdenados = resultados.slice().sort((a, b) => {
    const fechaA = new Date(a.creado_en).getTime()
    const fechaB = new Date(b.creado_en).getTime()
    if (orden === 'mas_reciente') {
      return fechaB - fechaA
    } else {
      return fechaA - fechaB
    }
  })

  const handleConocerHistoria = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota)
    setMostrandoHistoria(true)
  }

  const handleDonar = (id: string) => {
    const mascota = resultados.find(c => c.mascota.id === id)?.mascota
    if (!mascota) return
    toast.success(`¡Gracias por tu interés en ayudar a ${mascota.nombre}! 🐾`)
    setMostrandoHistoria(false)
    router.push('/')
  }

  return (
    <div className="flex flex-col items-center justify-start py-10 px-4 bg-pink-50 min-h-screen">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
          Ayudá a una mascota en <span className="italic">situación crítica</span>
        </h1>
        <p className="text-gray-600 text-lg mb-6 text-center">
          Estos animales necesitan tu colaboración. Gracias por tu interés en ayudarlos.
        </p>

        {/* Filtros tipo y orden */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 max-w-md mx-auto mb-8">
          <div className="relative w-full max-w-xs">
            <select
              className="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'perro' | 'gato' | '')}
              aria-label="Filtrar por tipo de mascota"
            >
              <option value="">Todos</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-5 h-5 text-pink-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative w-full max-w-xs">
            <select
              className="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={orden}
              onChange={(e) => setOrden(e.target.value as 'mas_reciente' | 'mas_antiguo')}
              aria-label="Ordenar mascotas"
            >
              <option value="mas_reciente">Más reciente</option>
              <option value="mas_antiguo">Más antiguo</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-5 h-5 text-pink-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {cargando && <p className="text-center text-gray-500">Cargando casos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!cargando && resultados.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No se encontraron casos.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {resultadosOrdenados.map((caso) => (
            <MascotaCard
              key={caso.id}
              mascota={caso.mascota}
              onConocerHistoria={() => handleConocerHistoria(caso.mascota)}
              onAdoptar={() => handleDonar(caso.mascota.id)}
              modo="donacion"
            />
          ))}
        </div>
      </div>

      {mascotaSeleccionada && (
        <MascotaModal
          mascota={mascotaSeleccionada}
          visible={mostrandoHistoria}
          cargando={false}
          onClose={() => setMostrandoHistoria(false)}
          onAccion={() => handleDonar(mascotaSeleccionada.id)}
          modo="donacion"
        />
      )}
    </div>
  )
}
