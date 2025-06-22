'use client'

import { useState, useEffect } from 'react'

import MascotaCard from './MascotaCard'
import MascotaModal from './MascotaModal'
import { Mascota } from '@/types/mascotas'
import { Caso } from '@/types/casos'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { getMascotasEnAdopcion, getMascotasFiltradas } from '@/services/mascotas'

export default function AdopcionPage() {
  const router = useRouter()

  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState<Caso[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null)
  const [mostrandoHistoria, setMostrandoHistoria] = useState(false)
  const [cargandoHistoria] = useState(false)

  useEffect(() => {
  const timer = setTimeout(() => {
    const texto = busqueda.trim().toLowerCase()

    // Solo filtra si es 'perro' o 'gato'
    if (texto === 'perro' || texto === 'gato') {
      fetchMascotas({ tipo: texto })
    } else if (texto === '') {
      fetchMascotas({})
    } else {
      // Si escribe otra cosa, no busca nada
      setResultados([])
    }
  }, 400)

  return () => clearTimeout(timer)
}, [busqueda])

const fetchMascotas = async (filtros: { tipo?: string; nombre?: string }) => {
  setCargando(true)
  setError('')
  try {
    const data =
      Object.keys(filtros).length === 0
        ? await getMascotasEnAdopcion()
        : await getMascotasFiltradas(filtros)

    setResultados(data)
  } catch {
    setError('Hubo un error al cargar las mascotas.')
    setResultados([])
  } finally {
    setCargando(false)
  }
}

  const handleConocerHistoria = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota)
    setMostrandoHistoria(true)
  }

  const handleAdoptar = (id: string) => {
    const mascota = resultados.find(c => c.mascota.id === id)?.mascota
    if (!mascota) return
    toast.success(`¡Gracias por querer adoptar a ${mascota.nombre}! 🐶🐱`)
    setMostrandoHistoria(false)
    router.push('/adoptar/formulario-adopcion')
  }

  return (
    <div className="flex flex-col items-center justify-start py-10 px-4 bg-pink-50 min-h-screen">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
          Mi raza favorita es <span className="italic">adoptada</span>
        </h1>
        <p className="text-gray-600 text-lg mb-6 text-center">
          Encontrá a tu nuevo mejor amigo. Filtrá por tipo o nombre.
        </p>

        <div className="w-full max-w-md mx-auto relative mb-8">
          <input
            type="text"
            placeholder="Buscar por tipo (perro / gato) o nombre (ej: Luna)"
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

        {cargando && <p className="text-center text-gray-500">Cargando mascotas...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!cargando && resultados.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No se encontraron mascotas.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {resultados.map((caso) => (
            <MascotaCard
              key={caso.id}
              mascota={caso.mascota}
              onConocerHistoria={() => handleConocerHistoria(caso.mascota)}
              onAdoptar={() => handleAdoptar(caso.mascota.id)}
            />
          ))}
        </div>
      </div>

      {mascotaSeleccionada && (
        <MascotaModal
          mascota={mascotaSeleccionada}
          visible={mostrandoHistoria}
          cargando={cargandoHistoria}
          onClose={() => setMostrandoHistoria(false)}
          onAdoptar={() => handleAdoptar(mascotaSeleccionada.id)}
        />
      )}
    </div>
  )
}