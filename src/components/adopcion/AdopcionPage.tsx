'use client'

import { useState, useEffect, useCallback } from 'react'

import MascotaCard from './MascotaCard'
import MascotaModal from './MascotaModal'
import { Mascota } from '@/types/mascotas'
import { Caso } from '@/types/casos'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { getMascotasEnAdopcion, getMascotasFiltradas } from '@/services/mascotas'

export default function AdopcionPage() {
  const router = useRouter()

  // Ahora tipo puede ser '', 'perro' o 'gato'
  const [tipo, setTipo] = useState<'perro' | 'gato' | ''>('')
  const [resultados, setResultados] = useState<Caso[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null)
  const [mostrandoHistoria, setMostrandoHistoria] = useState(false)
  const [cargandoHistoria] = useState(false)
  const [orden, setOrden] = useState<'mas_reciente' | 'mas_antiguo'>('mas_reciente')

  const fetchMascotas = useCallback(async (filtros: { tipo?: string }) => {
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
  }, [])

  // Traer mascotas cuando cambien tipo o al inicio (tipo inicial '')
  useEffect(() => {
    fetchMascotas(tipo ? { tipo } : {})
  }, [tipo, fetchMascotas])

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

  const handleAdoptar = (id: string) => {
   const caso = resultados.find(c => c.mascota.id === id)
if (!caso) return



toast.success(`¡Gracias por querer adoptar a ${caso.mascota.nombre}! 🐶🐱`)
setMostrandoHistoria(false)
router.push(`/adoptar/formulario-adopcion?id=${caso.mascota.id}`)


  }

  return (
    <div className="flex flex-col items-center justify-start py-10 px-4 bg-pink-50 min-h-screen">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
          Mi raza favorita es <span className="italic">adoptada</span>
        </h1>
        <p className="text-gray-600 text-lg mb-6 text-center">
          Encontrá a tu nuevo mejor amigo.
        </p>

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


        {cargando && <p className="text-center text-gray-500">Cargando mascotas...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!cargando && resultados.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No se encontraron mascotas.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
         {resultadosOrdenados.map((caso) => {
  const mascota = {
    ...caso.mascota,
    casoId: caso.id,
    tipo: caso.tipo.toLowerCase(), 
    descripcion: caso.descripcion, 
  }

  return (
    <MascotaCard
      key={caso.id}
      mascota={mascota}
      onConocerHistoria={() => handleConocerHistoria(mascota)}
      onAdoptar={() => handleAdoptar(mascota.id)}
      modo="adopcion"
    />
  )
})}

        </div>
      </div>

      {mascotaSeleccionada && (
        <MascotaModal
          mascota={mascotaSeleccionada}
          visible={mostrandoHistoria}
          cargando={cargandoHistoria}
          onClose={() => setMostrandoHistoria(false)}
          onAccion={() => handleAdoptar(mascotaSeleccionada.id)}
          modo="adopcion"
        />
      )}
    </div>
  )
}
