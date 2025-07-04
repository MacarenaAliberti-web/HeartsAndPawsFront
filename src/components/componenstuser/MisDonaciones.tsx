'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMisDonaciones } from '@/services/usuario';
import DonacionCard from './DonacionCard';

interface Donacion {
  id: string;
  monto: number;
  fecha: string;
  estadoPago: string;
    casoDonacionId: string;
  organizacion: {
    nombre: string; 
  };
  mascota: {
    nombre: string;
    casos: {
      descripcion: string;
    }[];
  };
}

export default function MisDonaciones() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

useEffect(() => {
  async function fetchDonaciones() {
    try {
      const data = await getMisDonaciones();

      // Ordenamos de más reciente a más antigua
      const ordenadas = data.sort(
        (a: Donacion, b: Donacion) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      setDonaciones(ordenadas);
    } catch {
      setError('No se pudieron cargar tus donaciones');
    } finally {
      setLoading(false);
    }
  }

  fetchDonaciones();
}, []);


  return (
    <div className="flex min-h-screen bg-pink-50">
      {/* Panel lateral */}
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
          className="text-left px-3 py-2 rounded hover:bg-pink-700"
        >
          Mis Adopciones
        </button>

        <button
          onClick={() => router.push('/usuario/donaciones')}
          className="text-left px-3 py-2 rounded hover:bg-pink-700 bg-pink-700"
        >
          Mis Donaciones
        </button>

 <button
          onClick={() => router.push('/usuario/favoritos')}
          className="text-left px-3 py-2 rounded hover:bg-pink-700 bg-pink-700"
        >
          Mis Favoritos
        </button>

      </nav>

      {/* Contenido principal */}
      <main className="flex-1 p-10 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">Mis Donaciones</h1>


        
         {loading && (
          <p className="text-center text-gray-500 mt-10">⏳ Cargando tus solicitudes...</p>
        )}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && donaciones.length === 0 && (
            <p>No tenés donaciones aún.</p>
          )}
          {!loading && !error && donaciones.length > 0 && (
            <div className="space-y-6">
              {donaciones.map((donacion) => (
                <DonacionCard key={donacion.id} donacion={donacion} />
              ))}
            </div>
          )}
       
      </main>
    </div>
  );
}
