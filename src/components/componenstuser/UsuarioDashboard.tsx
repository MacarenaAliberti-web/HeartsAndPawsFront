"use client";

import { useState, useEffect } from "react";

import { useUsuarioAuth } from "@/context/UsuarioAuthContext";
//import { Usuario} from "@/types/user";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { ActualizarPerfil } from "@/services/dashboarusernormal";

export default function DashboardSencillo() {
  const { usuario } = useUsuarioAuth();
  const [user, setUser] = useState<User | null>(null);
  const [seccionActiva, setSeccionActiva] = useState<"perfil" | "datos">(
    "perfil"
  );
  const [isEditando, setIsEditando] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagenPerfil, setImagenPerfil] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [userData, setUserData] = useState<{
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    pais: string;
    imagenPerfil?: string;
  }>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    pais: "",
  });

  useEffect(() => {
    const getUserSupabase = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (usuario) {
        console.log("soy usuario local: " + JSON.stringify(usuario));
        setUserData({
          nombre: usuario.nombre || "",
          email: usuario.email || "",
          telefono: usuario.telefono || "",
          direccion: usuario.direccion || "",
          ciudad: usuario.ciudad || "",
          pais: usuario.pais || "",
          imagenPerfil: usuario.imagenPerfil || "",
        });
      } else if (user) {
        console.log("soy user supabase: " + JSON.stringify(user));
        setUserData({
          nombre:
            user.user_metadata["full_name"] || user.user_metadata["name"] || "",
          email: user?.email || "",
          telefono: "",
          direccion: "",
          ciudad: "",
          pais: "",
          imagenPerfil:
            user.user_metadata["avatar_url"] ||
            user.user_metadata["picture"] ||
            "",
        });
        setUser(user);
      }
    };

    getUserSupabase();

    if (!user && !usuario) {
      setSeccionActiva("perfil");
    }
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    setIsEditando(false);

    console.log("Datos actualizados localmente:", userData);
  };

  const handleAtualizar = async (archivo: File) => {
    console.log("Handle Actualizar");
    setUploading(true);

    try {
      await ActualizarPerfil(archivo, usuario?.id);
      const nuevaUrl = URL.createObjectURL(archivo);

      setImagenPerfil(archivo);
      setUserData((prev) => ({
        ...prev,
        imagenPerfil: nuevaUrl,
      }));
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-pink-50">
      {/* Panel lateral */}
      <nav className="flex flex-col px-4 py-6 text-white bg-pink-600 w-60">
        <h2 className="mb-8 text-xl font-semibold text-center">
          Panel del Usuario
        </h2>

        <button
          onClick={() => setSeccionActiva("perfil")}
          className={`mb-4 text-left px-3 py-2 rounded ${
            seccionActiva === "perfil"
              ? "bg-pink-800 font-semibold"
              : "hover:bg-pink-700"
          }`}
        >
          Mi perfil
        </button>

        <button
          onClick={() => setSeccionActiva("datos")}
          className={`text-left px-3 py-2 rounded ${
            seccionActiva === "datos"
              ? "bg-pink-800 font-semibold"
              : "hover:bg-pink-700"
          }`}
        >
          Mis datos
        </button>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 p-10">
        {seccionActiva === "perfil" && (
          <section>
            <h1 className="mb-6 text-3xl font-bold text-pink-700">Mi perfil</h1>

            <header className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                {/* Imagen actual de perfil */}
                <div className="relative w-32 h-32">
                  <img
                    src={userData.imagenPerfil || "/default-avatar.png"}
                    alt={`Foto de perfil de ${userData.nombre}`}
                    className="w-70 h-32 rounded-full object-cover border-2 border-pink-400 shadow"
                  />

                  <label
                    htmlFor="imagen-perfil"
                    className="absolute bottom-0 right-0 bg-pink-600 hover:bg-pink-700 text-white p-1 rounded-full cursor-pointer transition"
                    title="Cambiar imagen"
                  >
                    📷
                    <input
                      id="imagen-perfil"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const archivo = e.target.files?.[0];
                        if (!archivo) return;
                        const objectUrl = URL.createObjectURL(archivo);
                        setPreviewUrl(objectUrl);
                        handleAtualizar(archivo);
                      }}
                    />
                  </label>
                </div>

                <div>
                  <p className="text-lg font-semibold text-pink-700">
                    {userData.nombre}
                  </p>
                  <p className="text-sm text-gray-600">Hola!</p>
                </div>
              </div>
            </header>

            <div className="flex gap-4">
              <button className="px-6 py-2 font-semibold text-white transition bg-pink-500 rounded hover:bg-pink-600">
                Adoptar
              </button>
              <button className="px-6 py-2 font-semibold text-white transition bg-pink-400 rounded hover:bg-pink-500">
                Donar
              </button>
            </div>
          </section>
        )}

        {seccionActiva === "datos" && (
          <section>
            <h1 className="mb-6 text-3xl font-bold text-pink-700">Mis datos</h1>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGuardar();
              }}
              className="max-w-xl p-6 space-y-5 bg-white rounded shadow"
            >
              {(
                [
                  "nombre",
                  "email",
                  "telefono",
                  "direccion",
                  "ciudad",
                  "pais",
                ] as const
              ).map((campo) => (
                <div key={campo}>
                  <label
                    htmlFor={campo}
                    className="block mb-1 font-semibold text-pink-700 capitalize"
                  >
                    {campo}
                  </label>
                  <input
                    id={campo}
                    name={campo}
                    type={campo === "email" ? "email" : "text"}
                    disabled={!isEditando}
                    value={userData[campo]}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${
                      isEditando
                        ? "border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        : "border-gray-300 bg-gray-100 cursor-not-allowed"
                    }`}
                    required={campo === "nombre" || campo === "email"}
                  />
                </div>
              ))}

              {!isEditando && (
                <button
                  type="button"
                  onClick={() => setIsEditando(true)}
                  className="px-6 py-2 text-white transition bg-pink-600 rounded hover:bg-pink-700"
                >
                  Editar
                </button>
              )}

              {isEditando && (
                <button
                  type="submit"
                  className="px-6 py-2 text-white transition bg-pink-600 rounded hover:bg-pink-700"
                >
                  Guardar
                </button>
              )}
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
