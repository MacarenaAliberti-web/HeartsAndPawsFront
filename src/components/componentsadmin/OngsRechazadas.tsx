'use client';

import { getTotalOrganizacionesRechazadas } from '@/services/adminconexion';
import React, { useEffect, useState } from 'react';

interface Organizacion {
  id: string;
  nombre: string;
  ciudad: string;
  email: string;
  descripcion: string;
 imagenPerfil: null | string
}

export default function OngsRechazadas() {
  const [ongs, setOngs] = useState<Organizacion[]>([]);

  useEffect(() => {
    const obtenerOngs = async () => {
      try {
        const res = await getTotalOrganizacionesRechazadas();
        if (!res || !res.ok) throw new Error('Error al obtener ONGs');
        const data = await res.json();
        setOngs(data);
      } catch (error) {
        console.error('Error cargando ONGs:', error);
      }
    };

    obtenerOngs();
  }, []);

  return (
    <div className="min-h-screen bg-pink-100 p-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-6 text-center">
        Organizaciones Rechazadas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ongs.map((org) => (
          <div
            key={org.id}
            className="bg-white border border-pink-300 rounded-lg p-5 shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={org.imagenPerfil ?? "/default-profile.png"}
                alt={`Foto de ${org.nombre}`}
                className="w-24 h-24 object-cover border-4 border-pink-500 rounded-full shadow"
              />
              <div>
                <h2 className="text-lg font-bold text-pink-700">{org.nombre}</h2>
                <p className="text-sm text-gray-600">{org.ciudad}</p>
                <p className="text-sm text-gray-500 mt-2">{org.descripcion}</p>
                <p className="text-sm text-pink-500 mt-2">{org.email}</p>
              </div>
            </div>
          </div>
        ))}

        {ongs.length === 0 && (
          <p className="col-span-full text-center text-pink-600">
            No hay Organizaciones rechazadas.
          </p>
        )}
      </div>
    </div>
  );
}
