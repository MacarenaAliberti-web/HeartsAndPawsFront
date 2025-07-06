'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

import DatosPersonales from './DatosPersonales'
import SeccionHogar from './SeccionHogar'
import Compromisos from './Compromisos'
import DeclaracionFinal from './DeclaracionFinal'

import { FormularioAdopcionData } from '@/types/formularioadopcion'
import { enviarSolicitudAdopcion, obtenerCasoAdopcionId } from '@/services/adopcion'
import { useAuth } from '@/components/SupabaseProvider'

function pasoValido(paso: number, formData: FormularioAdopcionData): boolean {
  switch (paso) {
    case 1:
      return (
        formData.tipoVivienda.trim() !== '' &&
        formData.integrantesFlia > 0 &&
        formData.hijos >= 0 &&
        formData.hayOtrasMascotas >= 0 &&
        (formData.hayOtrasMascotas === 0 ||
          (formData.descripcionOtrasMascotas?.trim() || '') !== '')
      )
    case 2:
      return (
        formData.cubrirGastos === 'Sí' &&
        formData.darAlimentoCuidados === 'Sí' &&
        formData.darAmorTiempoEj === 'Sí' &&
        formData.devolucionDeMascota === 'Sí' &&
        (formData.siNoPodesCuidarla?.trim() || '') !== ''
      )
    case 3:
      return true
    case 4:
      return formData.declaracionFinal === 'Sí'
    default:
      return false
  }
}

export default function FormularioAdopcionPage() {
  const [paso, setPaso] = useState(1)
  const [loading, setLoading] = useState(false) // <- nuevo estado
  const router = useRouter()
  const searchParams = useSearchParams()
const { token } = useAuth();
  const [casoId, setCasoId] = useState('')
  const [formData, setFormData] = useState<FormularioAdopcionData>({
    casoAdopcionId: '',
    tipoVivienda: '',
    integrantesFlia: 0,
    hijos: 0,
    hayOtrasMascotas: 0,
    descripcionOtrasMascotas: '',
    cubrirGastos: '',
    darAlimentoCuidados: '',
    darAmorTiempoEj: '',
    devolucionDeMascota: '',
    siNoPodesCuidarla: '',
    declaracionFinal: '',
  })

  useEffect(() => {
    const casoParam = searchParams?.get('id') || ''
    setCasoId(casoParam)
  }, [searchParams])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (
      name === 'hayOtrasMascotas' ||
      name === 'integrantesFlia' ||
      name === 'hijos'
    ) {
      const min = name === 'integrantesFlia' ? 1 : 0
      const num = Number(value)
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(num) || num < min ? min : num,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const avanzarPaso = () => {
    if (!pasoValido(paso, formData)) {
      toast.error('Por favor, completá todos los campos obligatorios.')
      return
    }
    setPaso((prev) => prev + 1)
  }

  const enviarFormulario = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pasoValido(paso, formData)) {
      toast.error('Debes completar correctamente este paso.')
      return
    }

    if (!casoId) {
      toast.error('Falta el ID del caso de adopción.')
      return
    }

    setLoading(true) // <- activar loading
try {
  const casoAdopcionId = await obtenerCasoAdopcionId(casoId)

  await enviarSolicitudAdopcion(
    { ...formData, casoAdopcionId },
    casoAdopcionId, token
  )

  toast.success('¡Solicitud enviada con éxito!')
  router.push('/adoptar/usuario-adopcion-exitoso')
  return // ⬅️ Esto evita que se ejecute el `finally`
} catch (error: unknown) {
  if (
    error instanceof Error &&
    error.message.includes('no puede enviar mas de 1 solicitud')
  ) {
    toast.error('Ya has enviado una solicitud para este caso.')
    setTimeout(() => {
      router.push('/adoptar/adopcion')
    }, 2000)
    return // ⬅️ También salir aquí
  }

  toast.error('Error al enviar formulario. Por favor, intenta nuevamente.')
} finally {
  setLoading(false)
}

  }

  const pasos = [
    <SeccionHogar key="paso1" formData={formData} onChange={handleChange} />,
    <Compromisos key="paso2" formData={formData} onChange={handleChange} />,
    <div key="paso3" className="space-y-6">
      <DatosPersonales />
    </div>,
    <DeclaracionFinal key="paso4" formData={formData} onChange={handleChange} />,
  ]

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4 flex justify-center relative">
      <form
        className="w-full max-w-3xl space-y-10 bg-white p-8 rounded-xl shadow-md"
        onSubmit={enviarFormulario}
      >
        <div className="flex justify-center items-center space-x-6 mb-6 select-none">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`flex flex-col items-center ${
                paso === num ? 'text-pink-600 font-bold' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 ${
                  paso === num ? 'border-pink-600 bg-pink-100' : 'border-gray-300'
                }`}
              >
                {num}
              </div>
              <span className="text-xs">Paso {num}</span>
            </div>
          ))}
        </div>

        {pasos[paso - 1]}

        <div className="flex justify-center mt-6 gap-4 flex-wrap">
          {paso > 1 && (
            <button
              type="button"
              onClick={() => setPaso((prev) => prev - 1)}
              className="px-4 py-2 text-white bg-pink-400 rounded hover:bg-pink-500 transition"
            >
              Atrás
            </button>
          )}

          {paso === 3 && (
            <button
              type="button"
              onClick={() => router.push('/dashboard/usuario')}
              className="px-4 py-2 bg-pink-100 text-pink-600 border border-pink-300 rounded hover:bg-pink-200 transition"
            >
              Editar mis datos personales
            </button>
          )}

          {paso < pasos.length ? (
            <button
              type="button"
              onClick={avanzarPaso}
              className={`px-4 py-2 text-white rounded transition ${
                pasoValido(paso, formData)
                  ? 'bg-pink-600 hover:bg-pink-700'
                  : 'bg-pink-300 cursor-not-allowed'
              }`}
              disabled={!pasoValido(paso, formData)}
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded transition ${
                pasoValido(paso, formData)
                  ? 'bg-pink-600 hover:bg-pink-700'
                  : 'bg-pink-300 cursor-not-allowed'
              }`}
              disabled={!pasoValido(paso, formData)}
            >
              Enviar solicitud
            </button>
          )}
        </div>
      </form>

      {/* Overlay loading */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto">
          <div className="text-pink-600 font-semibold text-lg animate-pulse text-center mb-4">
            Enviando solicitud, por favor aguardá...
          </div>
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
