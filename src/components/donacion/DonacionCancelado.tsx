'use client'

export default function DonacionCanceladaPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Donación cancelada</h1>
      <p className="text-lg text-gray-700">
        Parece que cancelaste el proceso de donación. Si fue un error, ¡podés intentarlo de nuevo!
      </p>
    </div>
  )
}
