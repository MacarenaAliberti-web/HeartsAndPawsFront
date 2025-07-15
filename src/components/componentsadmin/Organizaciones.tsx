"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getTodosOng,
  getTotalOrganizacionesAprobadas,
} from "@/services/adminconexion";

interface Organizacion {
  id: string;
  nombre: string;
  email: string;
  imagenPerfil: string | null;
  plan: string;
  creado_en: Date;
}

export default function OrganizacionesPanel() {
  const router = useRouter();
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [organizacionSeleccionada, setOrganizacionSeleccionada] = useState<Organizacion | null>(null);
  const [totalOrganizaciones, setTotalOrganizaciones] = useState<number>(0);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroPlan, setFiltroPlan] = useState("");

  const obtenerDatos = async (nombre?: string, plan?: string) => {
    try {
      const resOng = await getTodosOng({ nombre, plan });
      if (!resOng) return;
      const data = await resOng.json();
      setOrganizaciones(data);

      const total = await getTotalOrganizacionesAprobadas();
      setTotalOrganizaciones(total);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const handleBuscar = () => {
    obtenerDatos(filtroNombre, filtroPlan);
  };

  const handleLimpiar = () => {
    setFiltroNombre("");
    setFiltroPlan("");
    obtenerDatos();
  };

  return (
    <div className="flex min-h-screen bg-pink-50">
      <nav className="flex flex-col px-4 py-6 text-white bg-pink-600 w-60">
        <h2 className="mb-8 text-xl font-semibold text-center">Panel ONG</h2>
        <button
          onClick={() => router.push("/dashboard/admin/ong-rechazadas")}
          className="text-left px-3 py-2 rounded hover:bg-pink-700"
        >
          Rechazadas
        </button>
      </nav>

      <main className="flex-1 p-6">
        <div className="flex flex-col gap-4">
          {/* Tarjeta total */}
          <div className="flex justify-center mb-6">
            <div className="bg-white shadow rounded-lg p-4 w-fit border border-pink-300">
              <p className="text-sm text-gray-600">Total Aprobadas</p>
              <p className="text-2xl font-bold text-pink-700">{totalOrganizaciones}</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-pink-800">Organizaciones Registradas</h1>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Filtrar por nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="border border-pink-300 p-2 rounded"
            />

            <input
              type="text"
              placeholder="Filtrar por plan"
              value={filtroPlan}
              onChange={(e) => setFiltroPlan(e.target.value)}
              className="border border-pink-300 p-2 rounded"
            />

            <button
              onClick={handleBuscar}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
            >
              Buscar
            </button>

            <button
              onClick={handleLimpiar}
              className="bg-gray-300 text-pink-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Limpiar filtros
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {organizaciones.map((org) => (
              <div
                key={org.id}
                onClick={() => setOrganizacionSeleccionada(org)}
                className="cursor-pointer border border-pink-200 rounded-lg p-4 bg-white shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={org.imagenPerfil ?? "/default-profile.png"}
                    alt={`Foto de ${org.nombre}`}
                    className="w-24 h-24 object-cover border-4 border-pink-500 rounded-full shadow"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{org.nombre}</p>
                    <p className="text-sm text-gray-700 mb-1">{org.email}</p>
                    <span className="inline-block px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded-full">
                      {org.plan}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  🗓️ Registrado el {new Date(org.creado_en).toLocaleDateString("es-AR")}
                </p>
                <p className="text-sm text-pink-600 mt-1 underline">Ver más...</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {organizacionSeleccionada && (
        <div className="fixed inset-0 bg-pink-300 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setOrganizacionSeleccionada(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-pink-700 mb-2">
              {organizacionSeleccionada.nombre}
            </h2>
            <img
              src={organizacionSeleccionada.imagenPerfil ?? "/default-profile.png"}
              alt={`Foto de perfil de ${organizacionSeleccionada.nombre}`}
              className="w-40 h-40 object-cover border-4 border-pink-500 shadow-md rounded-full mx-auto mb-4"
            />
            <p className="text-sm text-gray-700 mb-1">
              <strong>Email:</strong> {organizacionSeleccionada.email}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Plan:</strong> {organizacionSeleccionada.plan}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Creado en:</strong>{" "}
              {new Date(organizacionSeleccionada.creado_en).toLocaleDateString("es-AR")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
