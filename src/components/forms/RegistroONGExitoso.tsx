'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'

export default function RegistroConfirmadoPage() {
  useEffect(() => {
    // Desactivar scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Restaurar scroll al desmontar
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  return (
   <div className="min-h-screen flex items-start justify-center bg-pink-50 px-4 pt-30">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4">
          ¡Gracias por registrar tu organización!
        </h1>
        <p className="text-gray-700 mb-4">
          Hemos recibido la información de tu organización dedicada al cuidado, protección y difusión de animales en situación de calle.
        </p>
        <p className="text-gray-700 mb-4">
          En las próximas <strong>24 horas</strong> recibirás un correo electrónico con el estado de tu solicitud: <strong>APROBADA</strong> o <strong>RECHAZADA</strong>, en caso de que no se haya podido validar algún tipo de documentación.
        </p>
        <p className="text-gray-700 mb-6">
          Si no recibís el correo dentro del plazo estipulado, recordá revisar la carpeta de <strong>correo no deseado</strong>. De no encontrarlo, por favor comunicate con el administrador del sistema.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}