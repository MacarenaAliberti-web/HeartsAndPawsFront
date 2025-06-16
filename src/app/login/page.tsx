'use client';

import { useRouter } from 'next/navigation';

export default function LoginTypeSelector() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg border border-pink-300">
        <h1 className="text-3xl font-bold text-pink-600 text-center mb-8">
          ¿Cómo querés iniciar sesión?
        </h1>

        <div className="flex flex-col gap-6">
          <button
            onClick={() => router.push('/login/loginUsuario')}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold py-4 px-6 rounded-md text-lg transition w-full border border-pink-400"
          >
            Ingresar con mi cuenta de Usuario
          </button>

          <button
            onClick={() => router.push('/login/loginONG')}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-md text-lg transition w-full"
          >
            Ingresar con mi cuenta de ONG
          </button>

          <button
            onClick={() => alert('Funcionalidad próximamente')}
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-4 px-6 rounded-md text-lg transition w-full"
          >
            Ingresar con Google
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Elegí el método de autenticación que prefieras.
        </p>
      </div>
    </div>
  );
}
