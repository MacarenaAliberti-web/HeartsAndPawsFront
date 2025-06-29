'use client';

import { useState, useEffect } from "react";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";
import { supabase } from "@/lib/supabaseClient";
import { ActualizarPerfil } from "@/services/dashboarusernormal";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardSencillo() {
  const { usuario } = useUsuarioAuth();
  const router = useRouter();

  const [isEditando, setIsEditando] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      const { data: { user } } = await supabase.auth.getUser();

      if (usuario) {
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
        setUserData({
          nombre: user.user_metadata["full_name"] || user.user_metadata["name"] || "",
          email: user?.email || "",
          telefono: "",
          direccion: "",
          ciudad: "",
          pais: "",
          imagenPerfil: user.user_metadata["avatar_url"] || user.user_metadata["picture"] || "",
        });
      }
    };

    getUserSupabase();
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    setIsEditando(false);
    console.log("Datos actualizados:", userData);
  };

  const handleActualizar = async (archivo: File) => {
    setUploading(true);
    try {
      await ActualizarPerfil(archivo, usuario?.id);
      const nuevaUrl = URL.createObjectURL(archivo);
      setUserData((prev) => ({
        ...prev,
        imagenPerfil: nuevaUrl,
      }));
    } catch (error) {
      console.error("Error al subir imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-pink-50">
      {/* Panel lateral */}
      <nav className="flex flex-col px-4 py-6 text-white bg-pink-600 w-60">
        <h2 className="mb-8 text-xl font-semibold text-center">Perfil del Usuario</h2>

        <button
          onClick={() => router.push("/dashboard/usuario")}
          className="text-left px-3 py-2 rounded hover:bg-pink-700"
        >
          Principal
        </button>

        <button
          onClick={() => router.push("/usuario/adopciones")}
          className="text-left px-3 py-2 rounded hover:bg-pink-700"
        >
          Mis Adopciones
        </button>

        <button
          onClick={() => router.push("/usuario/donaciones")}
          className="text-left px-3 py-2 rounded hover:bg-pink-700"
        >
          Mis Donaciones
        </button>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 p-10">
        <section className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 border border-pink-100">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative w-28 h-28">
              <div className="w-28 h-28 rounded-full border-2 border-pink-400 shadow overflow-hidden relative bg-white">
                {uploading ? (
                  <span className="text-sm text-pink-500 font-semibold animate-pulse flex items-center justify-center h-full">
                    Cargando...
                  </span>
                ) : (
                  <Image
                    src={userData.imagenPerfil || "/gato-y-amor.jpg"}
                    alt={`Foto de perfil de ${userData.nombre}`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
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
                    if (archivo) handleActualizar(archivo);
                  }}
                />
              </label>
            </div>

            <div>
              <p className="text-2xl font-bold text-pink-700">Hola, {userData.nombre}!</p>
              <p className="text-sm text-gray-500">Bienvenido a tu perfil personal</p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGuardar();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {(
              ["nombre", "email", "telefono", "direccion", "ciudad", "pais"] as const
            ).map((campo) => (
              <div key={campo}>
                <label
                  htmlFor={campo}
                  className="block mb-1 text-sm font-medium text-pink-700 capitalize"
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
                  className={`w-full px-3 py-2 rounded border text-sm ${
                    isEditando
                      ? "border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
                      : "border-gray-300 bg-gray-100 cursor-not-allowed"
                  }`}
                  required={campo === "nombre" || campo === "email"}
                />
              </div>
            ))}

            <div className="col-span-full flex justify-end gap-4 mt-4">
              {!isEditando ? (
                <button
                  type="button"
                  onClick={() => setIsEditando(true)}
                  className="px-6 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded"
                >
                  Editar
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded"
                >
                  Guardar
                </button>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
