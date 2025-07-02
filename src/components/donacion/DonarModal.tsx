'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'

type DonarModalProps = {
  visible: boolean
  onClose: () => void
  onConfirm: (monto: number) => Promise<void> | void
}

export default function DonarModal({
  visible,
  onClose,
  onConfirm,
}: DonarModalProps) {
  const { usuario } = useUsuarioAuth()
  const router = useRouter()

  const [monto, setMonto] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)

  if (!visible) return null

  const opciones = [3000, 5000, 10000]

  const handleConfirmar = async () => {
  if (!usuario) {
    toast.error('Necesitás iniciar sesión para donar.')
    router.push('/login')
    return
  }

  const montoFinal = typeof monto === 'number' ? monto : 0

  if (montoFinal < 1000) {
    toast.error('Ingresá un monto válido (mínimo $1000).')
    return
  }

  setLoading(true)
  toast.loading('Redirigiéndote a Stripe para procesar tu donación... 💳')

  try {
    await onConfirm(montoFinal)
    // 🔥 No llamamos onClose aquí: el redireccionamiento ocurre desde onConfirm
  } catch  {
    toast.dismiss()
    toast.error('Error al procesar la donación.')
    setLoading(false)
  }
}


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-pink-100 bg-opacity-30">
      <div className="relative bg-pink-50 rounded-2xl shadow-lg max-w-md w-full p-6 border border-pink-200 overflow-hidden">

        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10 bg-[url('/huellas-bg.png')] bg-contain bg-repeat pointer-events-none"></div>

        {/* Overlay de bloqueo */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="animate-spin mb-4 border-4 border-pink-300 border-t-transparent rounded-full w-10 h-10"></div>
            <p className="text-pink-600 font-semibold">
              Estamos redirigiéndote a la página de pago de Stripe.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              El monto será convertido a USD 💵. No cierres ni recargues esta ventana.
            </p>
          </div>
        )}

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-pink-500 hover:text-pink-700 text-3xl font-bold z-10"
          aria-label="Cerrar"
          disabled={loading}
        >
          &times;
        </button>

        <h2 className="text-2xl font-extrabold text-pink-600 mb-4 text-center relative z-10">
          Elegí un monto para donar
        </h2>

        {/* Opciones de monto */}
        <div className="flex justify-center gap-3 mb-4 z-10 relative">
          {opciones.map((opcion) => (
            <button
              key={opcion}
              onClick={() => setMonto(opcion)}
              className={`px-4 py-2 rounded-full border ${
                monto === opcion
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-pink-600 border-pink-300 hover:bg-pink-100'
              } transition-all duration-200`}
              disabled={loading}
            >
              ${opcion}
            </button>
          ))}
        </div>

        {/* Monto personalizado */}
        <div className="relative z-10 mb-6 text-center">
          <label className="block text-sm text-pink-700 mb-1">Otro monto</label>
          <input
            type="number"
            className="w-full px-4 py-2 rounded-full border border-pink-300 focus:ring-2 focus:ring-pink-400 outline-none"
            placeholder="Ingresá otro monto"
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            min={1}
            disabled={loading}
          />
        </div>

        {/* Botón confirmar */}
        <div className="text-center relative z-10">
          <button
            onClick={handleConfirmar}
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : '¡Quiero Donar!'}
          </button>
        </div>
      </div>
    </div>
  )
}
