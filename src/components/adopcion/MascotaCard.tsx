'use client'

import { MascotaCardConModoProps } from '@/types/mascotas'
import Image from 'next/image'
import React, { useState } from 'react'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { FaHeart, FaRegHeart } from 'react-icons/fa' 

export default function MascotaCard({
  mascota,
  onConocerHistoria,
  onAdoptar,
  modo
}: MascotaCardConModoProps) {
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

    onAdoptar?.(mascota.id)
  }

  const toggleFavorito = () => {
    if (!usuario) {
      toast.error('Iniciá sesión para guardar favoritos.')
      return
    }

    setEsFavorito(prev => !prev)
    // Opcional: llamar a una API para guardar/eliminar de favoritos
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col relative">
      {/* Icono de favorito */}
      <button
        onClick={toggleFavorito}
        className="absolute top-3 right-3 text-pink-500 text-3xl z-10"

        aria-label="Marcar como favorito"
      >
        {esFavorito ? <FaHeart /> : <FaRegHeart />}
      </button>

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
          >
            Conocer historia
          </button>
          <button
            onClick={handleAccion}
            className="w-full border border-pink-600 text-pink-600 hover:bg-pink-50 py-2 px-4 rounded-full transition"
          >
            {textoBotonAccion}
          </button>
        </div>
      </div>
    </div>
  )
}
