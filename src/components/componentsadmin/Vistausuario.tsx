'use client';
import { getTodosUser } from "@/services/adminconexion";
import React, { useEffect, useState } from "react";

type Usuario = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  imagenPerfil?: string | null;
  rol?: string;
};

export const Vistausuario: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroPais, setFiltroPais] = useState<string>("Todos");
  const [filtroRol, setFiltroRol] = useState<string>("Todos");

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const res = await getTodosUser();

        if (!res || !res.ok) throw new Error("Error al obtener los usuarios");

        const data = await res.json();
        setUsuarios(data); 
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };

    obtenerUsuarios();
  }, []);

  
  const paises = ["Todos", ...new Set(usuarios.map((u) => u.pais).filter(Boolean))];
  const roles = ["Todos", ...new Set(usuarios.map((u) => u.rol).filter(Boolean))];


  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincidePais = filtroPais === "Todos" || usuario.pais === filtroPais;
    const coincideRol = filtroRol === "Todos" || usuario.rol === filtroRol;
    return coincidePais && coincideRol;
  });

  return (
    <div className="min-h-screen bg-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">
          Usuarios Logueados
        </h2>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <select
            className="p-2 rounded-md border border-pink-400"
            value={filtroPais}
            onChange={(e) => setFiltroPais(e.target.value)}
          >
            {paises.map((pais) => (
              <option key={pais} value={pais}>
                {pais}
              </option>
            ))}
          </select>

          <select
            className="p-2 rounded-md border border-pink-400"
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
          >
            {roles.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de usuarios */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {usuariosFiltrados.map((user) => (
            <div
              key={user.id}
              className="bg-pink-200 rounded-xl shadow-md p-5 hover:bg-pink-300 transition-all"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={user.imagenPerfil ?? "/default-avatar.png"}
                  alt={user.nombre}
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
                />
                <div>
                  <p className="text-lg font-semibold text-pink-800">{user.nombre}</p>
                  <p className="text-sm text-pink-600">{user.email}</p>
                  <p className="text-sm text-pink-500">{user.ciudad}, {user.pais}</p>
                  {user.rol && (
                    <p className="text-xs text-pink-700 bg-pink-300 rounded px-2 mt-1 inline-block">
                      Rol: {user.rol}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {usuariosFiltrados.length === 0 && (
            <p className="text-center text-pink-600 col-span-full">No hay usuarios con esos filtros.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vistausuario;
