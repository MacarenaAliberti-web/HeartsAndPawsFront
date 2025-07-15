'use client'

import { useEffect, useState } from 'react'
import { useUsuarioAuth } from '@/context/UsuarioAuthContext'
import { supabase } from '@/lib/supabaseClient'

type DatosUsuario = {
  nombre: string
  email: string
  telefono?: string
  direccion?: string
  ciudad?: string
  pais?: string
}

export default function DatosPersonales() {
  const { usuario } = useUsuarioAuth()
  const [datosSupabase, setDatosSupabase] = useState<DatosUsuario | null>(null)

  useEffect(() => {
    const obtenerDatos = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        const user = data.user
        const meta = user.user_metadata || {}
        setDatosSupabase({
          nombre: meta.nombre || '',
          email: user.email || '',
          telefono: meta.telefono || '',
          direccion: meta.direccion || '',
          ciudad: meta.ciudad || '',
          pais: meta.pais || '',
        })
      }
    }

    obtenerDatos()
  }, [])

  const datos = datosSupabase || usuario

  if (!datos) return null

  const items = [
    { label: 'Nombre completo', valor: datos.nombre },
    { label: 'Email', valor: datos.email },
    { label: 'Teléfono', valor: datos.telefono || 'No especificado' },
    { label: 'Dirección', valor: datos.direccion || 'No especificado' },
    { label: 'Ciudad', valor: datos.ciudad || 'No especificado' },
    { label: 'País', valor: datos.pais || 'No especificado' },
  ]

  return (
    <div className="max-w-xl mx-auto bg-white border border-pink-300 rounded-xl p-8 shadow-md">
      <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">Datos Personales</h2>
      <p className="text-sm text-gray-700 mb-6 text-center">
        Estos datos serán enviados junto con tu solicitud. Si deseas modificarlos, por favor actualízalos desde tu perfil de usuario y vuelve a iniciar el formulario de adopción.
      </p>
      <ul className="space-y-4">
        {items.map((dato, index) => (
          <li key={index}>
            <span className="block text-sm font-medium text-gray-600">{dato.label}</span>
            <span className="block text-base text-gray-900">{dato.valor}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
