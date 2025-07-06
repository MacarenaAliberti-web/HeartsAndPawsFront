'use client'

import React from 'react'
import Image from 'next/image'

type Donacion = {
  id: string
  monto: number
  fecha: string
  estadoPago: string
  mascota: {
    nombre: string
    imagenes?: { url: string }[]
  }
  organizacion: {
    nombre: string
  }
  casoDonacionId: string
}

type DonacionCardProps = {
  donacion: Donacion
}

export default function DonacionCard({ donacion }: DonacionCardProps) {
  const fechaFormateada = new Date(donacion.fecha).toLocaleDateString('es-AR')

  const estadoPagoTraducido: Record<string, string> = {
    paid: 'Pagado',
    pending: 'Pendiente',
    failed: 'Fallido',
    canceled: 'Cancelado',
  }

  const colorEstadoPago: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    canceled: 'bg-gray-200 text-gray-700',
  }

  const iconoEstado: Record<string, string> = {
    paid: '✅',
    pending: '⏳',
    failed: '❌',
    canceled: '🚫',
  }

  const estado = donacion.estadoPago
  const textoEstado = estadoPagoTraducido[estado] || estado
  const color = colorEstadoPago[estado] || 'bg-gray-100 text-gray-800'
  const icono = iconoEstado[estado] || '❔'

const TASA_CAMBIO = 1205; 
const montoEnPesos = donacion.monto * TASA_CAMBIO;


  return (
    <div className="relative bg-white border border-pink-300 rounded-lg shadow-md p-4 md:pr-24 flex flex-col md:flex-row gap-4">
      {/* Badge flotante: en el centro a la derecha en md+, arriba a la derecha en mobile */}
      <div
        className={`absolute right-4 top-4 md:top-1/2 md:-translate-y-1/2 text-sm md:text-base px-4 md:px-5 py-1.5 md:py-2 rounded-full font-semibold capitalize flex items-center gap-2 ${color}`}
      >
        <span>{icono}</span>
        <span>{textoEstado}</span>
      </div>

      {/* Imagen de la mascota o ícono por defecto */}
<div className="w-full md:w-32 h-32 flex items-center justify-center bg-pink-100 rounded-md overflow-hidden relative">
  {donacion.mascota.imagenes?.[0]?.url ? (
    <Image
      src={donacion.mascota.imagenes[0].url}
      alt={`Foto de ${donacion.mascota.nombre}`}
      fill
      className="object-cover"
    />
  ) : (
    <span className="text-pink-500 text-5xl z-10">🐾</span>
  )}
</div>

      {/* Info principal */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-pink-600 mb-1">{donacion.mascota.nombre}</h2>
        <p className="text-gray-700 font-medium">{donacion.organizacion.nombre}</p>
        <p className="text-gray-600 text-sm mt-1">
  <span className="font-semibold">Monto:</span> ${donacion.monto.toLocaleString()} USD (~${montoEnPesos.toLocaleString()} ARS)
</p>

        <p className="text-gray-600 text-sm">
          <span className="font-semibold">Fecha:</span> {fechaFormateada}
        </p>
      </div>
    </div>
  )
}
