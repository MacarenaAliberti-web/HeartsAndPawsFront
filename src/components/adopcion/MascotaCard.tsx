'use client'

import { MascotaCardProps } from '@/types/mascotas'
import Image from 'next/image'
import React from 'react'

export default function MascotaCard({ mascota, onConocerHistoria, onAdoptar }: MascotaCardProps) {
  const imagenUrl = mascota.imagenes?.[0]?.url ?? 'https://via.placeholder.com/400x300?text=Mascota'

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col">
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
            onClick={() => onConocerHistoria?.(mascota.id)}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-full transition"
          >
            Conocer historia
          </button>
          <button
            onClick={() => onAdoptar?.(mascota.id)}
            className="w-full border border-pink-600 text-pink-600 hover:bg-pink-50 py-2 px-4 rounded-full transition"
          >
            Adoptar
          </button>
        </div>
      </div>
    </div>
  )
}
