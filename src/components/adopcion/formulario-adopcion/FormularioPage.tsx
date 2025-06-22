'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // ✅ Importá esto
import { toast } from 'react-hot-toast'
import DatosPersonales from './DatosPersonales'
import SeccionHogar from './SeccionHogar'
import Compromisos from './Compromisos'
import DeclaracionFinal from './DeclaracionFinal'
import { FormularioAdopcionData } from '@/types/formularioadopcion'

function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function pasoValido(paso: number, formData: FormularioAdopcionData): boolean {
  switch (paso) {
    case 1:
      return (
        formData.nombre.trim() !== '' &&
        formData.edad.trim() !== '' &&
        formData.telefono.trim() !== '' &&
        formData.email.trim() !== '' &&
        validarEmail(formData.email) &&
        formData.dni.trim() !== '' &&
        formData.direccion.trim() !== '' &&
        formData.ocupacion.trim() !== '' &&
        formData.estadoCivil.trim() !== ''
      )
    case 2:
      return (
        formData.tipoVivienda.trim() !== '' &&
        formData.conQuienVives.trim() !== '' &&
        formData.tieneMascotas !== null &&
        (formData.tieneMascotas === 'No' || formData.otrasMascotas.trim() !== '')
      )
    case 3:
      return (
        formData.gastosVeterinarios === 'Sí' &&
        formData.alimentacion === 'Sí' &&
        formData.dedicacion === 'Sí' &&
        formData.devolucionResponsable === 'Sí' &&
        formData.quePasaSiNoPuedo.trim() !== ''
      )
    case 4:
      return formData.declaracionFinal === 'Sí'
    default:
      return false
  }
}

export default function FormularioAdopcionPage() {
  const [paso, setPaso] = useState(1)
  const router = useRouter() // ✅ Inicializá el router

  const [formData, setFormData] = useState<FormularioAdopcionData>({
    nombre: '',
    edad: '',
    dni: '',
    direccion: '',
    telefono: '',
    email: '',
    ocupacion: '',
    estadoCivil: '',

    tipoVivienda: '',
    conQuienVives: '',
    hijosEdades: '',
    otrosConviven: '',
    tieneMascotas: null,
    otrasMascotas: '',

    gastosVeterinarios: '',
    alimentacion: '',
    dedicacion: '',
    devolucionResponsable: '',
    quePasaSiNoPuedo: '',

    declaracionFinal: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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

    try {
      // await fetch('/api/adopciones', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })

      toast.success('¡Solicitud enviada con éxito!')

      // ✅ Redirección después de éxito
      router.push('/adoptar/usuario-adopcion-exitoso')
    } catch (error) {
      console.error(error)
      toast.error('Error al enviar formulario.')
    }
  }

  const pasos = [
    <DatosPersonales key="paso1" formData={formData} onChange={handleChange} />,
    <SeccionHogar key="paso2" formData={formData} onChange={handleChange} />,
    <Compromisos key="paso3" formData={formData} onChange={handleChange} />,
    <DeclaracionFinal key="paso4" formData={formData} onChange={handleChange} />,
  ]


  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4 flex justify-center">
      <form
        className="w-full max-w-3xl space-y-10 bg-white p-8 rounded-xl shadow-md"
        onSubmit={enviarFormulario}
      >
        {/* Indicador de pasos */}
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

        {/* Paso actual */}
        {pasos[paso - 1]}

        {/* Navegación */}
        <div className="flex justify-center mt-6 space-x-4">
          {paso > 1 && (
            <button
              type="button"
              onClick={() => setPaso((prev) => prev - 1)}
              className="px-4 py-2 text-white bg-pink-400 rounded hover:bg-pink-500 transition"
            >
              Atrás
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
    </div>
  )
}
