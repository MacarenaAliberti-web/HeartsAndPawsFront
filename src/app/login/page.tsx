// app/login/page.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function LoginSelector() {
  const router = useRouter();

  return (
    <div className="max-w-md p-8 mx-auto mt-12 bg-white rounded shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-center text-pink-600">
        Selecciona cómo quieres iniciar sesión
      </h1>

      <div className="space-y-4">
        <button
          onClick={() => router.push('/login/google')}
          className="w-full py-3 text-white bg-pink-600 rounded hover:bg-bpink-700"
        >
          Iniciar sesión con Google
        </button>

        <button
          onClick={() => router.push('/login/login-ong')}
          className="w-full py-3 text-white bg-pink-600 rounded hover:bg-pink-700"
        >
          Iniciar sesión como ONG
        </button>

        <button
          onClick={() => router.push('/login/login-user')}
          className="w-full py-3 text-white bg-pink-600 rounded hover:bg-pink-700"
        >
          Iniciar sesión como Usuario
        </button>
      </div>
    </div>
  );
}
