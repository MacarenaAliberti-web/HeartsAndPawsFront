'use client'

import { useUsuarioAuth } from '@/context/UsuarioAuthContext'

export default function DatosPersonales() {
  const { usuario } = useUsuarioAuth()

  if (!usuario) return null

  const datos = [
    { label: 'Nombre completo', valor: usuario.nombre },
    { label: 'Email', valor: usuario.email },
    { label: 'Teléfono', valor: usuario.telefono || 'No especificado' },
    { label: 'Dirección', valor: usuario.direccion || 'No especificado' },
    { label: 'Ciudad', valor: usuario.ciudad || 'No especificado' },
    { label: 'País', valor: usuario.pais || 'No especificado' },
  ]

  return (
    <div className="max-w-xl mx-auto bg-white border border-pink-300 rounded-xl p-8 shadow-md">
      <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">Datos Personales</h2>
      <ul className="space-y-4">
        {datos.map((dato, index) => (
          <li key={index}>
            <span className="block text-sm font-medium text-gray-600">{dato.label}</span>
            <span className="block text-base text-gray-900">{dato.valor}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
