"use client";

import { useEffect, useState } from "react";
import { getTodasAdopciones } from "@/services/adminconexion";

type Adopcion = {
  id: string;
  estado: string;
  caso: {
    titulo: string;
    descripcion: string;
    creado_en: string;
    mascota: {
      nombre: string;
      edad: number;
      descripcion: string;
      imagenes: { url: string }[];
    ongId: string;
    organizacion: {
      nombre: string;
      pais: string;
      ciudad: string;
    };
     };
  };
};

export default function AdopcionesRegistradas() {
  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarAdopciones() {
      try {
        const res = await getTodasAdopciones();
        if (!res) return;
        const data = await res.json();
        setAdopciones(data);
        console.log("soy adopciones: " + JSON.stringify(data));
      } catch (err) {
        console.log("Error cargando adopciones:", err);
        setError("No se pudieron cargar las adopciones.");
      }
    }

    cargarAdopciones();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">
        Adopciones Registradas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {adopciones.map((adopcion) => (
          <div
            key={adopcion.id}
            className="bg-white rounded-xl shadow-md p-4 border border-pink-200"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  adopcion.caso.mascota.imagenes[0]?.url || "/default-pet.jpg"
                }
                alt={adopcion.caso.mascota.nombre}
                className="w-32 h-32 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-bold text-pink-700">
                  {adopcion.caso.titulo}
                </h2>
                <p className="text-sm text-gray-700">
                  {adopcion.caso.descripcion}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  🐾 Mascota: {adopcion.caso.mascota.nombre} (
                  {adopcion.caso.mascota.edad} años)
                </p>
                <p className="text-sm text-gray-600">
                  🏠 Organización:{" "}
                  {adopcion.caso.mascota.organizacion.nombre || "Desconocida"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Estado: <span className="font-medium">{adopcion.estado}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
