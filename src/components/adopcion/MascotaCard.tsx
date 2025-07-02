'use client'

import { MascotaCardConModoProps } from '@/types/mascotas'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { putAgregarAFavoritos, getFavoritosPorUsuario } from '@/services/favoritos'

// Tipo parcial de lo que devuelve la API
interface FavoritoItem {
  caso: {
    id: string
  }
}

interface Props extends MascotaCardConModoProps {
  mostrarFavorito?: boolean // prop opcional para mostrar/ocultar el corazón
}

export default function MascotaCard({
  mascota,
  onConocerHistoria,
  onAdoptar,
  modo,
  mostrarFavorito = true, // por defecto mostrar el corazón
}: Props) {
  const { usuario } = useUsuarioAuth()
  const router = useRouter()

  const [esFavorito, setEsFavorito] = useState(false)

  const imagenUrl =
    mascota.imagenes?.[0]?.url ??
    'https://via.placeholder.com/400x300?text=Mascota'

  const textoBotonAccion = modo === 'adopcion' ? 'Adoptar' : 'Donar'

  const handleAccion = () => {
    if (!usuario) {
      toast.error('Necesitás iniciar sesión para continuar.')
      router.push('/login')
      return
    }

    onAdoptar?.(mascota.casoId)
  }

  const toggleFavorito = async () => {
    if (!usuario) {
      toast.error('Iniciá sesión para guardar favoritos.')
      router.push('/login')
      return
    }

    try {
      await putAgregarAFavoritos(usuario.id, mascota.casoId)
      setEsFavorito((prev) => !prev)
      toast.success(
        esFavorito ? 'Eliminado de favoritos' : 'Agregado a favoritos'
      )
    } catch (error) {
      console.error(error)
      toast.error('No se pudo actualizar el favorito.')
    }
  }

  useEffect(() => {
    const cargarFavoritos = async () => {
      if (!usuario) return

      try {
        const favoritos: FavoritoItem[] = await getFavoritosPorUsuario(usuario.id)
        const estaEnFavoritos = favoritos.some((f) => f.caso.id === mascota.casoId)
        setEsFavorito(estaEnFavoritos)
      } catch (error) {
        console.error('Error al cargar favoritos', error)
      }
    }

    cargarFavoritos()
  }, [usuario, mascota.casoId])

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col relative">
      {/* Icono de favorito solo si mostrarFavorito es true */}
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

      <div className="w-full h-48 p-2 flex items-center justify-center bg-white">
        <Image
          src={imagenUrl}
          alt={mascota.nombre}
          width={180}
          height={130}
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <h2 className="text-xl font-bold text-pink-600 mb-2">{mascota.nombre}</h2>

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
            className="w-full border border-pink-600 text-pink-600 hover:bg-pink-50 py-2 px-4 rounded-full transition"
            type="button"
          >
            {textoBotonAccion}
          </button>
        </div>
      </div>
    </div>
  )
}
