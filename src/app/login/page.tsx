// app/login/page.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function LoginSelector() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg border border-pink-300">
        <h1 className="text-3xl font-bold text-pink-600 text-center mb-8">
          ¿Cómo querés iniciar sesión?
        </h1>

       <div className="flex flex-col gap-6">
        <button
          onClick={() => router.push('/login/login')}
         className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-md text-lg transition w-full"
        >
          Iniciar sesión con Google
        </button>

        <button
          onClick={() => router.push('/login/login-ong')}
           className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold py-4 px-6 rounded-md text-lg transition w-full border border-pink-400"
        >
          Iniciar sesión como ONG
        </button>

        <button
          onClick={() => router.push('/login/login-user')}
         className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold py-4 px-6 rounded-md text-lg transition w-full border border-pink-400"
        >
          Iniciar sesión como Usuario
        </button>
      </div>
     <p className="text-center text-gray-600 mt-6 text-sm">
          Elegí la opción que se corresponda con tu cuenta.
        </p>
      </div>
    </div>
  );
}