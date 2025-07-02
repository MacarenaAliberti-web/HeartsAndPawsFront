'use client'

import { MascotaModalProps } from '@/types/mascotas'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { getDetalleDonacionPorCaso } from '@/services/donacion'
import { useEffect, useState } from 'react' // ✅ import necesario

export default function MascotaModal({
  mascota,
  visible,
  cargando = false,
  onClose,
  onAccion,
  modo,
}: MascotaModalProps) {
  const { usuario } = useUsuarioAuth()
  const router = useRouter()

  const [meta, setMeta] = useState<number | null>(null)
  const [recaudado, setRecaudado] = useState<number | null>(null)

  useEffect(() => {
    const cargarDonacion = async () => {
      if (modo !== 'donacion' || !mascota.casoId) return
      try {
        const detalle = await getDetalleDonacionPorCaso(mascota.casoId)
        setMeta(detalle.metaDonacion)
        setRecaudado(detalle.estadoDonacion)
        console.log('Donación modal:', detalle) // opcional
      } catch (error) {
        console.error('Error al obtener meta en el modal:', error)
      }
    }

    cargarDonacion()
  }, [modo, mascota.casoId])

  const imagenUrl =
    mascota.imagenes?.[0]?.url ?? 'https://via.placeholder.com/400x300?text=Mascota'

  const textoBoton = modo === 'adopcion' ? '¡Quiero Adoptar!' : '¡Quiero Donar!'

  const handleAccion = () => {
    if (!usuario) {
      toast.error('Necesitás iniciar sesión para continuar.')
      router.push('/login')
      return
    }

    onAccion?.(mascota.casoId ?? mascota.id)
  }

  const metaAlcanzada =
    modo === 'donacion' &&
    meta !== null &&
    recaudado !== null &&
    recaudado >= meta

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-pink-100 bg-opacity-30">
      <div className="relative bg-pink-50 rounded-2xl shadow-lg max-w-md w-full p-6 border border-pink-200 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/huellas-bg.png')] bg-contain bg-repeat pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-pink-500 hover:text-pink-700 text-3xl font-bold z-10"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <div className="mb-4 relative z-10">
          <Image
            src={imagenUrl}
            alt={mascota.nombre}
            width={400}
            height={300}
            className="rounded-md object-cover w-full"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-pink-600 mb-2 text-center relative z-10">
          {mascota.nombre}
        </h2>

        <div className="relative z-10 mb-6 max-h-48 overflow-y-auto">
          {cargando ? (
            <p className="text-center text-gray-500">Cargando historia...</p>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-center">
              {mascota.descripcion}
            </p>
          )}
        </div>

        <div className="text-center z-10 relative">
          <button
            onClick={handleAccion}
            disabled={metaAlcanzada}
            className={`px-6 py-3 rounded-full shadow-md transition-all duration-300 font-semibold ${
              metaAlcanzada
                ? 'bg-pink-200 text-pink-500 cursor-not-allowed'
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {metaAlcanzada ? 'Meta alcanzada 🐾' : textoBoton}
          </button>
        </div>
      </div>
    </div>
  )
}
