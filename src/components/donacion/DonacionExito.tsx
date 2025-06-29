'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function DonacionExitosaPage() {
  const searchParams = useSearchParams()
  
  const sessionId = searchParams?.get('session_id')

  useEffect(() => {
    console.log('Donación exitosa con session_id:', sessionId)

  }, [sessionId])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6 text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">¡Gracias por tu donación! 🐾</h1>
      <p className="text-lg text-gray-700">
        Tu ayuda hace la diferencia. Te agradecemos profundamente por colaborar.
      </p>
    </div>
  )
}
