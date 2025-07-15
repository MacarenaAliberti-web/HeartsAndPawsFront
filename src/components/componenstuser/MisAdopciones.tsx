'use client';

import { useEffect, useState } from 'react';
import { getMisSolicitudesDeAdopcion } from '@/services/usuario';
import AdopcionCard from './AdopcionCard';
import { SolicitudDeAdopcion } from '@/types/adopcionesdeusuario';
import { useRouter } from 'next/navigation';
import { useAuth } from '../SupabaseProvider';

export default function MisAdopciones() {
  const [adopciones, setAdopciones] = useState<SolicitudDeAdopcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    async function fetchAdopciones() {
      try {
        const data = await getMisSolicitudesDeAdopcion(token ?? undefined);
          console.log('Solicitudes recibidas:', data); 
        setAdopciones(data);
      } catch {
        setError('No se pudieron cargar tus solicitudes');
      } finally {
        setLoading(false);
      }
    }
    fetchAdopciones();
  }, []);

  return (
    <div className="flex min-h-screen bg-pink-50">
      {/* Sidebar */}
      <nav className="flex flex-col px-4 py-6 text-white bg-pink-600 w-60">
        <h2 className="mb-8 text-xl font-semibold text-center">Perfil del Usuario</h2>

        <button
          onClick={() => router.push('/dashboard/usuario')}
          className="text-left px-3 py-2 rounded hover:bg-pink-700"
        >
          Principal
        </button>

        <button
          onClick={() => router.push('/usuario/adopciones')}
          className="text-left px-3 py-2 rounded bg-pink-700 font-semibold"
        >
          Mis Adopciones
        </button>

        <button
          onClick={() => router.push('/usuario/donaciones')}
          className="text-left px-3 py-2 rounded hover:bg-pink-700"
        >
          Mis Donaciones
        </button>

<button
          onClick={() => router.push('/usuario/favoritos')}
          className="text-left px-3 py-2 rounded hover:bg-pink-700"
        >
          Mis Favoritos
        </button>
          <button
          onClick={() => router.push("/chat")}
          className="text-left px-3 py-2 rounded hover:bg-pink-700"
        >
          Mensajes
        </button>

      </nav>

      {/* Main content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6 text-pink-700 text-center">Mis Adopciones</h1>


        {loading && (
          <p className="text-center text-gray-500 mt-10">⏳ Cargando tus solicitudes...</p>
        )}

        {error && (
          <p className="text-center text-red-600 mt-10">{error}</p>
        )}

        {!loading && !error && adopciones.length === 0 && (
          <p className="text-center text-gray-500 mt-10">📭 No tenés solicitudes aún.</p>
        )}

        <div className="space-y-6 mt-6">
          {adopciones.map((adopcion) => (
            <AdopcionCard key={adopcion.id} adopcion={adopcion} />
          ))}
        </div>
      </main>
    </div>
  );
}
