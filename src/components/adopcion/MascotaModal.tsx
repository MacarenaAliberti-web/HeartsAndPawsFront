'use client'

import { MascotaModalProps } from '@/types/mascotas'
import Image from 'next/image'


export default function MascotaModal({
  mascota,
  visible,
  cargando = false,
  onClose,
  onAccion,
  modo,
}: MascotaModalProps) {
  if (!visible) return null

  const imagenUrl = mascota.imagenes?.[0]?.url ?? 'https://via.placeholder.com/400x300?text=Mascota'

  const textoBoton = modo === 'adopcion' ? '¡Quiero Adoptar!' : '¡Quiero Donar!'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-pink-100 bg-opacity-30">
      <div className="relative bg-pink-50 rounded-2xl shadow-lg max-w-md w-full p-6 border border-pink-200 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10 bg-[url('/huellas-bg.png')] bg-contain bg-repeat pointer-events-none"></div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-pink-500 hover:text-pink-700 text-3xl font-bold z-10"
          aria-label="Cerrar"
        >
          &times;
        </button>

        {/* Imagen */}
        <div className="mb-4 relative z-10">
          <Image
            src={imagenUrl}
            alt={mascota.nombre}
            width={400}
            height={300}
            className="rounded-md object-cover w-full"
          />
        </div>

        {/* Nombre */}
        <h2 className="text-3xl font-extrabold text-pink-600 mb-2 text-center relative z-10">
          {mascota.nombre}
        </h2>

        {/* Historia */}
        <div className="relative z-10 mb-6 max-h-48 overflow-y-auto">
          {cargando ? (
            <p className="text-center text-gray-500">Cargando historia...</p>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-center">
              {mascota.descripcion}
            </p>
          )}
        </div>

        {/* Botón Acción */}
        <div className="text-center z-10 relative">
          <button
            onClick={() => onAccion?.(mascota.id)}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300"
          >
            {textoBoton}
          </button>
        </div>
      </div>
    </div>
  )
}
