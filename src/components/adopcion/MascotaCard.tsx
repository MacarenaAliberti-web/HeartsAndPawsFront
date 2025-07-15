'use client'

import { MascotaCardConModoProps } from '@/types/mascotas'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { putAgregarAFavoritos, getFavoritosPorUsuario } from '@/services/favoritos'
import { getDetalleDonacionPorCaso } from '@/services/donacion'
import type { DetalleDonacion } from '@/types/detalledonacion'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '../SupabaseProvider'

interface FavoritoItem {
  caso: { id: string }
}

interface Props extends MascotaCardConModoProps {
  mostrarFavorito?: boolean
}

export default function MascotaCard({
  mascota,
  onConocerHistoria,
  onAdoptar,
  modo,
  mostrarFavorito = true,
}: Props) {
  const { usuario } = useUsuarioAuth()
  const { token } = useAuth()
  const router = useRouter()

  const [esFavorito, setEsFavorito] = useState(false)
  const [detalleDonacion, setDetalleDonacion] = useState<DetalleDonacion | null>(null)
  const [imagenActual, setImagenActual] = useState(0)
  const totalImagenes = mascota.imagenes?.length ?? 0

  const irAAnterior = () => setImagenActual((prev) => (prev === 0 ? totalImagenes - 1 : prev - 1))
  const irASiguiente = () => setImagenActual((prev) => (prev === totalImagenes - 1 ? 0 : prev + 1))

  const textoBotonAccion = modo === 'adopcion' ? 'Adoptar' : 'Donar'

  const getUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return usuario?.id || user?.id || null
  }

  const handleAccion = async () => {
    const userId = await getUserId()
    if (!userId) {
      toast.error('Necesitás iniciar sesión para continuar.')
      router.push('/login')
      return
    }
    onAdoptar?.(mascota.casoId)
  }

  const toggleFavorito = async () => {
    try {
      await putAgregarAFavoritos( mascota.casoId, token ?? undefined)
      setEsFavorito((prev) => !prev)
      toast.success(!esFavorito ? 'Agregado a favoritos' : 'Eliminado de favoritos')
    } catch (error) {
      console.error(error)
      toast.error('No se pudo actualizar el favorito.')
    }
  }

  useEffect(() => {
    const cargarFavoritos = async () => {
      

      try {
        const favoritos: FavoritoItem[] = await getFavoritosPorUsuario(token ?? undefined)
        const estaEnFavoritos = favoritos.some((f) => f.caso.id === mascota.casoId)
        setEsFavorito(estaEnFavoritos)
      } catch (error) {
        console.error('Error al cargar favoritos', error)
      }
    }

    cargarFavoritos()
  }, [ mascota.casoId, token])

  useEffect(() => {
    if (modo !== 'donacion') return

    const cargarDonacion = async () => {
      try {
        const detalle = await getDetalleDonacionPorCaso(mascota.casoId,token?? undefined)
        setDetalleDonacion(detalle)
      } catch (error) {
        console.error('Error al cargar meta de donación', error)
      }
    }

    cargarDonacion()
  }, [modo, mascota.casoId,token])

  const recaudado = detalleDonacion?.estadoDonacion ?? 0
  const meta = detalleDonacion?.metaDonacion ?? 0
  const porcentaje = meta > 0 ? Math.min((recaudado / meta) * 100, 100) : 0
  const metaAlcanzada = recaudado >= meta

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col relative h-full">
      {mostrarFavorito && (
        <button
          onClick={toggleFavorito}
          className="absolute top-3 right-3 text-pink-500 text-3xl z-10"
          aria-label="Marcar como favorito"
          type="button"
        >
          {esFavorito ? <FaHeart /> : <FaRegHeart />}
        </button>
      )}

      <div className="relative w-full h-48 bg-white flex items-center justify-center">
        {totalImagenes > 0 && (
          <Image
            src={mascota.imagenes[imagenActual]?.url}
            alt={mascota.nombre}
            width={180}
            height={130}
            className="object-contain"
          />
        )}
        {totalImagenes > 1 && (
          <>
            <button
              onClick={irAAnterior}
              className="absolute left-2 text-pink-600 text-xl bg-white rounded-full shadow p-1 hover:bg-pink-100 transition z-10"
              type="button"
            >
              ◀
            </button>
            <button
              onClick={irASiguiente}
              className="absolute right-2 text-pink-600 text-xl bg-white rounded-full shadow p-1 hover:bg-pink-100 transition z-10"
              type="button"
            >
              ▶
            </button>
          </>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <h2 className="text-xl font-bold text-pink-600 mb-2">{mascota.nombre}</h2>

        {modo === 'donacion' && detalleDonacion && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Recaudado: {detalleDonacion.estadoDonacionARS}</span>
              <span>Meta: {detalleDonacion.metaDonacionARS}</span>
            </div>

            <div className="relative w-full bg-red-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  metaAlcanzada ? 'bg-pink-500' : 'bg-green-500'
                }`}
                style={{ width: `${porcentaje}%` }}
              >
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-[10px] font-semibold">
                  {porcentaje.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto space-y-2">
          <button
            onClick={() => onConocerHistoria?.(mascota)}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-full transition"
            type="button"
          >
            Conocer historia
          </button>

          <button
            onClick={handleAccion}
            className={`w-full border py-2 px-4 rounded-full transition flex items-center justify-center ${
              modo === 'donacion' && metaAlcanzada
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                : 'border-pink-600 text-pink-600 hover:bg-pink-50'
            }`}
            type="button"
            disabled={modo === 'donacion' && metaAlcanzada}
            title={
              modo === 'donacion' && metaAlcanzada
                ? 'La meta ya fue alcanzada. Gracias por tu interés 💖'
                : ''
            }
          >
            {modo === 'donacion' && metaAlcanzada ? (
              <span className="text-lg text-pink-600 font-bold flex items-center gap-1">
                ¡Meta alcanzada! <span className="text-lg">🐾</span>
              </span>
            ) : (
              textoBotonAccion
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
