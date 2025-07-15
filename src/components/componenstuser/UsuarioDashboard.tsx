"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/SupabaseProvider";
import {
  ActualizarPerfil,
  ActualizarUsuario,
} from "@/services/dashboarusernormal";
import toast from "react-hot-toast";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";
import { supabase } from "@/lib/supabaseClient";

interface UsuarioUpdateData {
  email?: string;
  contrasena?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
}

export default function DashboardSencillo() {
  const { user } = useAuth();
  const router = useRouter();
  const { usuario } = useUsuarioAuth();
  const { token } = useAuth();

  const [isEditando, setIsEditando] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl] = useState<string | null>(null);
  

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
    if (!user && !usuario) return;

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
    }
  }, [user, usuario]);

  useEffect(() => {
    if (!user && !usuario) {
      // router.push("/login");
    }
  }, [user, router, usuario]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);
  useEffect(() => {
  const cargarDatosDesdeSupabase = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error al obtener usuario:", error);
      return;
    }

    const user = data?.user;
    if (user) {
      const meta = user.user_metadata || {};

      setUserData((prev) => ({
        ...prev,
        nombre: meta.nombre || prev.nombre, 
        telefono: meta.telefono || '',
        direccion: meta.direccion || '',
        ciudad: meta.ciudad || '',
        pais: meta.pais || '',
        imagenPerfil: meta.imagenPerfil || prev.imagenPerfil, 
      }));
    }
  };

  cargarDatosDesdeSupabase();
}, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

 const handleGuardar = async () => {
  try {
    const idUsuario = user?.id || usuario?.id;
    if (!idUsuario) throw new Error("Usuario no autenticado");

    const { email, telefono, direccion, ciudad, pais } = userData;

    const datos: UsuarioUpdateData = { email, telefono, direccion, ciudad, pais };

    // 1. Actualiza en tu backend
    await ActualizarUsuario(datos, token ?? undefined);

    // 2. Actualiza metadata de Supabase
    await supabase.auth.updateUser({
      data: { telefono, direccion, ciudad, pais },
    });

    // 3. Recupera el usuario actualizado
    const { data: userActualizado } = await supabase.auth.getUser();
    if (userActualizado?.user) {
      const meta = userActualizado.user.user_metadata || {};
      setUserData((prev) => ({
        ...prev,
        telefono: meta.telefono || '',
        direccion: meta.direccion || '',
        ciudad: meta.ciudad || '',
        pais: meta.pais || '',
      }));
    }

    toast.success("Perfil actualizado correctamente 🎉");
    setIsEditando(false);
  } catch (error) {
    console.error("Error al guardar perfil:", error);
    toast.error("Error inesperado al guardar.");
  }
};



  const handleActualizar = async (archivo: File) => {
    setUploading(true);
    try {
      await ActualizarPerfil(archivo, token!);
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

  if (!user && !usuario) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando usuario...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-pink-50">
      {/* Navegación lateral */}
      <nav className="flex flex-col px-4 py-6 text-white bg-pink-600 w-60">
        <h2 className="mb-8 text-xl font-semibold text-center">
          Perfil del Usuario
        </h2>
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
        <button
          onClick={() => router.push("/usuario/favoritos")}
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

      {/* Contenido principal */}
      <main className="flex-1 flex items-start justify-center pt-20 p-10 min-h-screen">
        <section className="w-full max-w-3xl bg-white rounded-lg shadow p-6 border border-pink-100">
          {/* Avatar */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative w-28 h-28">
              <div className="w-28 h-28 rounded-full border-2 border-pink-400 shadow overflow-hidden relative bg-white">
                {uploading ? (
                  <span className="text-sm text-pink-500 font-semibold animate-pulse flex items-center justify-center h-full">
                    Cargando...
                  </span>
                ) : (
                  <img
                    src={
                      previewUrl ||
                      userData.imagenPerfil ||
                      "/default-avatar.png"
                    }
                    alt={`Foto de perfil de ${userData.nombre}`}
                    className="w-32 h-32 rounded-full object-cover border-2 border-pink-400 shadow"
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
              <p className="text-2xl font-bold text-pink-700">
                Hola, {userData.nombre}!
              </p>
              <p className="text-sm text-gray-500">
                Bienvenido a tu perfil personal
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGuardar();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                  className="block mb-1 text-sm font-medium text-pink-700 capitalize"
                >
                  {campo}
                </label>

                {campo === "email" ? (
                  <input
                    id="email"
                    name="email"
                    type="email"
                    disabled
                    value={userData.email}
                    onClick={() =>
                      toast(
                        "El email es un campo definido que no permite edición"
                      )
                    }
                    className="w-full px-3 py-2 rounded border text-sm border-gray-300 bg-gray-100 cursor-not-allowed"
                  />
                ) : (
                  <input
                    id={campo}
                    name={campo}
                    type="text"
                    disabled={!isEditando}
                    value={userData[campo]}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded border text-sm transition ${
                      isEditando
                        ? "border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        : "border-gray-300 bg-gray-100 cursor-not-allowed"
                    }`}
                    required={campo === "nombre"}
                  />
                )}
              </div>
            ))}

            <div className="col-span-full flex justify-end gap-4 mt-4">
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
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
