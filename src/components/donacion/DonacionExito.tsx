'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'


export default function DonacionExitosaPage() {
  const searchParams = useSearchParams()
  
  const usuarioId = searchParams?.get('usuarioId')
  const casoId = searchParams?.get('casoId')

  useEffect(() => {
    // Podés registrar la donación si querés en tu base
    console.log('Donación exitosa:', { usuarioId, casoId })

    // También podrías hacer un toast o animación
  }, [usuarioId, casoId])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">¡Gracias por tu donación! 🐾</h1>
      <p className="text-lg text-gray-700">
        Tu ayuda hace la diferencia. Te agradecemos profundamente por colaborar.
      </p>
    </div>
  )
}
