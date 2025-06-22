'use client'

import Link from 'next/link'

export default function AdopcionExitosaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4">
          ¡Gracias por tu interés en adoptar!
        </h1>

        <p className="text-gray-700 mb-4">
          Hemos recibido tu solicitud de adopción y la estamos revisando cuidadosamente.
        </p>

        <p className="text-gray-700 mb-4">
          En las próximas <strong>48 horas</strong> recibirás un correo electrónico con el estado de tu solicitud. 
          Es posible que una organización se comunique con vos para coordinar una visita o ampliar información.
        </p>

        <p className="text-gray-700 mb-6">
          Recordá revisar tu <strong>bandeja de entrada</strong> y también la carpeta de <strong>correo no deseado</strong>.
          Si no recibís novedades dentro del plazo, podés contactarte con la organización que publicó el animal.
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
