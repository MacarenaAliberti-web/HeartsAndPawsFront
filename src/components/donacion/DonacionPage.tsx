'use client'

import { useState, useEffect } from 'react'
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

  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState<Caso[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null)
  const [mostrandoHistoria, setMostrandoHistoria] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const texto = busqueda.trim().toLowerCase()

      if (texto === 'perro' || texto === 'gato') {
        fetchMascotas({ tipo: texto })
      } else if (texto === '') {
        fetchMascotas({})
      } else {
        setResultados([])
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [busqueda])

  const fetchMascotas = async (filtros: { tipo?: string }) => {
    setCargando(true)
    setError('')
    try {
      const data =
        Object.keys(filtros).length === 0
          ? await getMascotasEnDonacion()
          : await getMascotasDonacionFiltradas(filtros)

      setResultados(data)
    } catch {
      setError('Hubo un error al cargar los casos de donación.')
      setResultados([])
    } finally {
      setCargando(false)
    }
  }

  // Ahora recibe directamente la mascota y abre el modal
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

        <div className="w-full max-w-md mx-auto relative mb-8">
          <input
            type="text"
            placeholder="Buscar por tipo (perro / gato)"
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <svg
            className="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.75 3.75a7.5 7.5 0 0012.9 12.9z" />
          </svg>
        </div>

        {cargando && <p className="text-center text-gray-500">Cargando casos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!cargando && resultados.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No se encontraron casos.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {resultados.map((caso) => (
            <MascotaCard
            
              key={caso.id}
              mascota={caso.mascota}
              onConocerHistoria={() => handleConocerHistoria(caso.mascota)} // paso mascota completa
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
          cargando={false} // no hay carga asíncrona aquí
          onClose={() => setMostrandoHistoria(false)}
          onAccion={() => handleDonar(mascotaSeleccionada.id)}
          modo="donacion"
        />
      )}
    </div>
  )
}
