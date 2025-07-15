"use client";

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
  creado_en: number;
};

export function Vistausuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const [filtroPais, setFiltroPais] = useState<string>("Todos");
  const [filtroRol, setFiltroRol] = useState<string>("Todos");
  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState<Usuario | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const obtenerUsuarios = async (nombre?: string, email?: string) => {
    try {
      const res = await getTodosUser({ nombre, email });

      if (!res || !res.ok) throw new Error("Error al obtener los usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  useEffect(() => {
    // Carga inicial sin filtros
    obtenerUsuarios();
  }, []);

  const handleBuscar = () => {
    obtenerUsuarios(filtroNombre, filtroEmail);
  };

  const paises = [
    "Todos",
    ...new Set(usuarios.map((u) => u.pais).filter(Boolean)),
  ];
  const roles = [
    "Todos",
    ...new Set(usuarios.map((u) => u.rol).filter(Boolean)),
  ];

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincidePais = filtroPais === "Todos" || usuario.pais === filtroPais;
    const coincideRol = filtroRol === "Todos" || usuario.rol === filtroRol;
    return coincidePais && coincideRol;
  });

  const abrirModal = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTimeout(() => setUsuarioSeleccionado(null), 300);
  };

  const getAvatarUrl = (nombre: string, imagenPerfil?: string | null) => {
    if (imagenPerfil) return imagenPerfil;
    const encodedName = encodeURIComponent(nombre || "Usuario Anónimo");
    return `https://ui-avatars.com/api/?name=${encodedName}&background=FFC0CB&color=fff&bold=true`;
  };

  return (
    <div className="min-h-screen bg-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">
          Usuarios Logueados
        </h2>

        {/* Tarjeta de total de usuarios */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white border border-pink-300 rounded-lg shadow-md px-6 py-4 text-center">
            <p className="text-sm text-pink-500">Usuarios registrados</p>
            <p className="text-2xl font-bold text-pink-700">
              {usuarios.length}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre"
            className="p-2 rounded-md border border-pink-400"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />

          <input
            type="text"
            placeholder="Buscar por email"
            className="p-2 rounded-md border border-pink-400"
            value={filtroEmail}
            onChange={(e) => setFiltroEmail(e.target.value)}
          />

          <button
            onClick={handleBuscar}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
          >
            Buscar
          </button>

          <button
            onClick={() => {
              setFiltroNombre("");
              setFiltroEmail("");
              setFiltroPais("Todos");
              setFiltroRol("Todos");
              obtenerUsuarios(); 
            }}
            className="px-4 py-2 bg-gray-300 text-pink-700 rounded-md hover:bg-gray-400 transition"
          >
            Limpiar filtros
          </button>

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
              onClick={() => abrirModal(user)}
              className="cursor-pointer bg-pink-200 rounded-xl shadow-md p-5 hover:bg-pink-300 transition-all"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={getAvatarUrl(user.nombre, user.imagenPerfil)}
                  alt={user.nombre}
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
                />
                <div>
                  <p className="text-lg font-semibold text-pink-800">
                    {user.nombre}
                  </p>
                  <p className="text-sm text-pink-600">{user.email}</p>
                  <p className="text-sm text-pink-500">
                    {user.ciudad}, {user.pais}
                  </p>
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
            <p className="text-center text-pink-600 col-span-full">
              No hay usuarios con esos filtros.
            </p>
          )}
        </div>
      </div>

      {/* Modal flotante */}
      {usuarioSeleccionado && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-pink-300 bg-opacity-50 z-50 transition-opacity ${
            mostrarModal ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md transform transition-all duration-300 ${
              mostrarModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <button
              onClick={cerrarModal}
              className="absolute top-2 right-4 text-pink-700 hover:text-pink-900 text-2xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold text-pink-700 mb-4">
              Detalles de {usuarioSeleccionado.nombre}
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <img
                src={getAvatarUrl(
                  usuarioSeleccionado.nombre,
                  usuarioSeleccionado.imagenPerfil
                )}
                alt={usuarioSeleccionado.nombre}
                className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-pink-400 mb-4"
              />
              <p>
                <strong>Nombre:</strong> {usuarioSeleccionado.nombre}
              </p>
              <p>
                <strong>Email:</strong> {usuarioSeleccionado.email}
              </p>
              <p>
                <strong>País:</strong> {usuarioSeleccionado.pais}
              </p>
              <p>
                <strong>Rol:</strong> {usuarioSeleccionado.rol ?? "Sin rol"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vistausuario;
