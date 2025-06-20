'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import toast from 'react-hot-toast';
import { getMyadmin, Patchsolicitud } from '@/services/adminconexion';

interface SolicitudONG {
  id: number;
  nombre: string;
  contacto: string;
  descripcion: string;
}

export default function AdminDashboard() {
  const { user } = useUser();
  const [requests, setRequests] = useState<SolicitudONG[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
         const res = await getMyadmin();
        if (!res || !res.ok) throw new Error('Error al obtener las ONGs');

        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error('Error cargando solicitudes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleDecision = async (id: number, decision: 'aprobada' | 'rechazada') => {
    try {
      const res = await Patchsolicitud(id, decision);
      if (!res || !res.ok) throw new Error('Error actualizando estado');

      setRequests((prev) => prev.filter((req) => req.id !== id));
      toast(`Solicitud ${id} fue ${decision === 'aprobada' ? 'aceptada' : 'rechazada'}.`);
    } catch (error) {
      console.error(`Error al ${decision === 'aprobada' ? 'aceptar' : 'rechazar'} solicitud`, error);
      toast('Hubo un error. Intenta nuevamente.');
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-pink-100 to-pink-200">
      <div className="max-w-4xl mx-auto">
        {/* Header con usuario */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-lg font-semibold text-pink-700">{user?.name}</p>
              <p className="text-sm text-gray-600">Administrador</p>
            </div>
          </div>
        </header>

        {/* Título */}
        <h1 className="flex items-center mb-6 text-3xl font-bold text-pink-700">
          <MdVerified className="mr-2 text-pink-600" />
          Solicitudes de Verificación de ONGs
        </h1>

        {/* Estado de carga */}
        {loading ? (
          <div className="font-semibold text-center text-pink-700">Cargando solicitudes...</div>
        ) : requests.length === 0 ? (
          <div className="p-6 text-center text-gray-600 bg-white rounded-lg shadow">
            No hay solicitudes pendientes.
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="p-5 mb-6 transition-shadow duration-200 bg-white border-2 border-pink-400 rounded-lg shadow-lg hover:shadow-pink-300"
            >
              <h2 className="mb-1 text-xl font-semibold text-pink-800">{req.nombre}</h2>
              <p className="mb-1 text-sm text-gray-600">
                <strong>Contacto:</strong> {req.contacto}
              </p>
              <p className="mb-4 text-sm text-gray-600">
                <strong>Descripción:</strong> {req.descripcion}
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleDecision(req.id, 'aprobada')}
                  className="flex items-center px-4 py-2 text-white bg-pink-600 rounded shadow hover:bg-pink-700"
                >
                  <FaCheckCircle className="mr-2" />
                  Aceptar
                </button>
                <button
                  onClick={() => handleDecision(req.id, 'rechazada')}
                  className="flex items-center px-4 py-2 text-black bg-gray-300 rounded shadow hover:bg-gray-400"
                >
                  <FaTimesCircle className="mr-2" />
                  Rechazar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
