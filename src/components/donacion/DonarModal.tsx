'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'

type DonarModalProps = {
  visible: boolean
  onClose: () => void
  onConfirm: (monto: number) => Promise<void> | void
  meta: number
  recaudado: number
}

export default function DonarModal({
  visible,
  onClose,
  onConfirm,
  meta,
  recaudado,
}: DonarModalProps) {
  const { usuario } = useUsuarioAuth()
  const router = useRouter()
  const [monto, setMonto] = useState<number | ''>('')
  const [errorMonto, setErrorMonto] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const faltante = Math.max(meta - recaudado, 0)
  const opciones = [3000, 5000, 10000]

  useEffect(() => {
    setMonto('')
    setErrorMonto(null)
    setLoading(false)
  }, [visible])

  if (!visible) return null

  const validarMonto = (valor: number) => {
    if (valor < 1000) return 'Ingresá al menos $1.000.'
    if (valor > faltante) return `Tu monto excede lo que falta ($${faltante}).`
    return null
  }

  const handleChange = (valor: number) => {
    setMonto(valor)
    setErrorMonto(validarMonto(valor))
  }

  const handleConfirmar = async () => {
    if (!usuario) {
      toast.error('Necesitás iniciar sesión para donar.')
      router.push('/login')
      return
    }

    const montoNum = typeof monto === 'number' ? monto : 0
    const err = validarMonto(montoNum)
    if (err) {
      setErrorMonto(err)
      return
    }

    setLoading(true)
    toast.loading('Redirigiéndote al pago...')

    try {
      await onConfirm(montoNum)
    } catch {
      toast.dismiss()
      toast.error('Error al procesar la donación.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-pink-100 bg-opacity-50 backdrop-blur-sm min-h-screen">
      <div className="relative bg-pink-50 rounded-2xl shadow-lg max-w-md w-full p-6 border border-pink-200">

        {/* Botón cerrar en la esquina superior derecha */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Cerrar modal"
          className="absolute top-2 right-3 text-pink-500 hover:text-pink-700 text-3xl font-bold z-10"
        >
          &times;
        </button>

        {/* Overlay de carga */}
        {loading && (
  <div className="absolute inset-0 z-30 bg-white bg-opacity-95 flex flex-col items-center justify-center text-center px-6">
    <div className="animate-spin border-4 border-pink-300 border-t-transparent rounded-full w-12 h-12 mb-4"></div>
    <p className="text-pink-600 font-semibold text-lg">
      Redirigiéndote a Stripe para completar el pago...
    </p>
    <p className="text-sm text-gray-500 mt-2">
      Tu donación será convertida a dólares. No cierres ni recargues esta ventana.
    </p>
  </div>
)}


        <h2 className="text-2xl font-extrabold text-pink-600 text-center mb-2">Doná para ayudar 🐾</h2>
        <p className="text-center mb-4 text-gray-600">
          Faltan <strong>${faltante}</strong> para alcanzar la meta.
        </p>

        <div className="flex gap-3 justify-center mb-4">
          {opciones.map((op) => (
            <button
              key={op}
              onClick={() => handleChange(op)}
              disabled={loading}
              className={`px-4 py-2 rounded-full transition ${
                monto === op
                  ? 'bg-pink-500 text-white'
                  : 'border border-pink-300 text-pink-600 bg-white hover:bg-pink-100'
              }`}
            >
              ${op}
            </button>
          ))}
        </div>

        <div className="mb-4 text-center">
          <input
            type="number"
            className="w-full px-4 py-2 border border-pink-300 rounded-full focus:ring-2 focus:ring-pink-400 outline-none"
            placeholder="Otro monto"
            value={monto}
            onChange={(e) => handleChange(Number(e.target.value))}
            disabled={loading}
            min={1}
          />
          {errorMonto && (
            <p className="text-sm text-red-600 mt-1">{errorMonto}</p>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={handleConfirmar}
            disabled={loading || !!errorMonto || monto === ''}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : '¡Quiero Donar!'}
          </button>
        </div>
      </div>
    </div>
  )
}
