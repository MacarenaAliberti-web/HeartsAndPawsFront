'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function LoginSelector() {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-pink-50 overflow-hidden flex items-center justify-center"
      style={{ padding: '1rem' }}
    >
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg border border-pink-300 box-border">
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