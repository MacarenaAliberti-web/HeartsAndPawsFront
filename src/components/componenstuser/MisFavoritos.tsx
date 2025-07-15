'use client';

import { useEffect, useState, useCallback } from "react";
import {
  getFavoritosPorUsuario,
  putAgregarAFavoritos,
} from "@/services/favoritos";
import {
  iniciarDonacion,
  getDetalleDonacionPorCaso,
} from "@/services/donacion";
import MascotaCard from "@/components/adopcion/MascotaCard";
import MascotaModal from "@/components/adopcion/MascotaModal";
import DonarModal from "@/components/donacion/DonarModal";
import { useAuth } from "@/components/SupabaseProvider";
import { Mascota } from "@/types/mascotas";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";

interface Imagen { url: string; }
interface MascotaFavorito { id?: string; nombre: string; imagenes?: Imagen[]; }
interface CasoFavorito {
  id: string; titulo: string; descripcion: string;
  tipo: "ADOPCION" | "DONACION" | string;
  mascotaId: string; creado_en: string;
  mascota: MascotaFavorito;
}
interface Favorito {
  id: string;
  casoId: string;
  caso: CasoFavorito;
}

export default function MisFavoritos() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [donarModalVisible, setDonarModalVisible] = useState(false);
  const [casoDonacionId, setCasoDonacionId] = useState<string | null>(null);
  const [detalleDonacion, setDetalleDonacion] = useState<{ meta: number; recaudado: number } | null>(null);
    const { usuario } = useUsuarioAuth();

  const fetchFavoritos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Token para favoritos:", token);
      const data = await getFavoritosPorUsuario(token ?? undefined);
      console.log("Favoritos obtenidos:", data);
      setFavoritos(data);
    } catch {
      setError("Error al cargar tus favoritos. Asegurate de estar logueado.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token !== undefined) fetchFavoritos();
  }, [fetchFavoritos, token]);

  const handleEliminarFavorito = async (fav: Favorito) => {
    if (!user && !usuario) {
      toast.error("Debes estar logueado para quitar favoritos");
      return;
    }
    try {
      await putAgregarAFavoritos(fav.casoId, token ?? undefined);
      toast.success("Favorito eliminado");
      fetchFavoritos();
    } catch {
      toast.error("No se pudo eliminar el favorito");
    }
  };
  const handleConocerHistoria = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota);
    setModalVisible(true);
  };

  const handleAdoptarODonar = async (casoId: string) => {
    const fav = favoritos.find((f) => f.caso.id === casoId);
    if (!fav) return toast.error("No se pudo encontrar el caso.");
    const tipo = fav.caso.tipo.toLowerCase() === "adopcion" ? "adopcion" : "donacion";

    const mascotaApi = fav.caso.mascota;
    if (!mascotaApi) return;
    const mascota: Mascota = {
      id: mascotaApi.id ?? fav.caso.mascotaId,
      casoId: fav.caso.id,
      nombre: mascotaApi.nombre,
      tipo,
      descripcion: fav.caso.descripcion,
      imagenes: (mascotaApi.imagenes ?? []).map((img, idx) => ({ id: img.url || `${idx}`, url: img.url })),
    };

    if (mascota.tipo === "adopcion") {
      toast.success(`¡Gracias por querer adoptar a ${mascota.nombre}!`);
      setModalVisible(false);
      router.push(`/adoptar/formulario-adopcion?id=${mascota.casoId}`);
    } else {
      setCasoDonacionId(mascota.casoId);
      setDonarModalVisible(true);
      try {
        const det = await getDetalleDonacionPorCaso(mascota.casoId, token ?? undefined);
        if (det) setDetalleDonacion({ meta: det.metaDonacion, recaudado: det.estadoDonacion });
        else toast.error("No se pudo obtener la información de la donación.");
      } catch {
        toast.error("Ocurrió un error al cargar los datos de donación.");
      }
    }
  };

 const handleConfirmarDonacion = async (monto: number): Promise<void> => {
  const usuarioId = user?.id || usuario?.id;

  if (!casoDonacionId || !usuarioId) {
    toast.error("Error: falta información para realizar la donación.");
    return;
  }

  try {
    const res = await iniciarDonacion({ casoId: casoDonacionId, monto }, token ?? undefined);
    if (res?.url) {
      window.location.href = res.url;
    } else {
      toast.error("No se pudo generar el link de pago.");
    }
  } catch {
    toast.error("Ocurrió un error al iniciar la donación.");
  }
};



  return (
    <div className="flex min-h-screen bg-pink-50">
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
          className="text-left px-3 py-2 rounded bg-pink-700 font-semibold"
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

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6 text-pink-700 text-center">Mis Favoritos</h1>

        {loading && <p className="text-center text-gray-500 mt-10">⏳ Cargando tus favoritos...</p>}
        {error && <p className="text-center text-red-600 mt-10">{error}</p>}
        {!loading && !error && favoritos.length === 0 && <p className="text-center text-gray-500 mt-10">📭 No tenés favoritos aún.</p>}
        {!loading && !error && favoritos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {favoritos.map((fav) => {
              const mascotaApi = fav.caso.mascota;
              if (!mascotaApi) return null;
              const mascota: Mascota = {
                id: mascotaApi.id ?? fav.caso.mascotaId,
                casoId: fav.caso.id,
                nombre: mascotaApi.nombre,
                tipo: fav.caso.tipo.toLowerCase() === "adopcion" ? "adopcion" : "donacion",
                imagenes: (mascotaApi.imagenes ?? []).map((img, idx) => ({ id: img.url || `${idx}`, url: img.url })),
                descripcion: fav.caso.descripcion,
              };
              return (
                <div key={fav.id} className="relative h-full">
                  <MascotaCard
                    mascota={mascota}
                    modo={mascota.tipo as "adopcion" | "donacion"}
                    onConocerHistoria={handleConocerHistoria}
                    onAdoptar={() => handleAdoptarODonar(mascota.casoId)}
                    mostrarFavorito={false}
                  />
                  <button
                    onClick={() => handleEliminarFavorito(fav)}
                    className="absolute top-2 right-2 text-black-600 hover:text-red-800"
                    aria-label="Eliminar favorito"
                  >
                   <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 18M9 6V4.5a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 4.5V6m4.5 0H4.5m1.5 0v12a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0017.25 18V6"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {mascotaSeleccionada && (
          <MascotaModal
            visible={modalVisible}
            mascota={mascotaSeleccionada}
            onClose={() => setModalVisible(false)}
            onAccion={handleAdoptarODonar}
            modo={mascotaSeleccionada.tipo as "adopcion" | "donacion"}
          />
        )}

        <DonarModal
          visible={donarModalVisible}
          onClose={() => { setDonarModalVisible(false); setDetalleDonacion(null); }}
          onConfirm={handleConfirmarDonacion}
          meta={detalleDonacion?.meta ?? 0}
          recaudado={detalleDonacion?.recaudado ?? 0}
        />
      </main>
    </div>
  );
}
