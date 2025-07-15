"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Mascota } from "@/types/mascotas";
import { Caso } from "@/types/casos";
import {
  getMascotasEnDonacion,
  getMascotasDonacionFiltradas,
} from "@/services/mascotas";
import {
  iniciarDonacion,
  getDetalleDonacionPorCaso,
} from "@/services/donacion";
import MascotaCard from "@/components/adopcion/MascotaCard";
import MascotaModal from "@/components/adopcion/MascotaModal";
import DonarModal from "./DonarModal";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";
import { DetalleDonacion } from "@/types/detalledonacion";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../SupabaseProvider";

export default function DonacionPage() {
  const { usuario } = useUsuarioAuth();

  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);

  const [tipo, setTipo] = useState<"perro" | "gato" | "">(""); // filtro tipo
  const [orden, setOrden] = useState<"mas_reciente" | "mas_antiguo">(
    "mas_reciente"
  );
  const [resultados, setResultados] = useState<Caso[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mascotaSeleccionada, setMascotaSeleccionada] =
    useState<Mascota | null>(null);
  const [mostrandoHistoria, setMostrandoHistoria] = useState(false);

  // Estados para el modal de donación
  const [donarModalVisible, setDonarModalVisible] = useState(false);
  const [mascotaParaDonar, setMascotaParaDonar] = useState<Mascota | null>(
    null
  );
  const [detalleDonacion, setDetalleDonacion] =
    useState<DetalleDonacion | null>(null);
  const { token } = useAuth();

  // Detectar sesión supabase (si existe)
  useEffect(() => {
    const obtenerUsuarioSupabase = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user?.id) {
        setUserSupabaseId(data.user.id);
      }
    };

    obtenerUsuarioSupabase();
  }, []);

  const fetchMascotas = useCallback(async (filtros: { tipo?: string }) => {
    setCargando(true);
    setError("");
    try {
      const data =
        Object.keys(filtros).length === 0
          ? await getMascotasEnDonacion()
          : await getMascotasDonacionFiltradas(filtros);
      setResultados(data);
    } catch {
      setError("Hubo un error al cargar los casos de donación.");
      setResultados([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchMascotas(tipo ? { tipo } : {});
  }, [tipo, fetchMascotas]);

  const resultadosOrdenados = resultados.slice().sort((a, b) => {
    const fechaA = new Date(a.creado_en).getTime();
    const fechaB = new Date(b.creado_en).getTime();
    return orden === "mas_reciente" ? fechaB - fechaA : fechaA - fechaB;
  });

  const handleConocerHistoria = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota);
    setMostrandoHistoria(true);
  };

  const handleDonar = async (mascota: Mascota) => {
    if (!mascota.casoId) {
      toast.error("Falta el caso de la mascota.");
      return;
    }

    try {
      const detalle = await getDetalleDonacionPorCaso(
        mascota.casoId,
        token ?? undefined
      );
      if (!detalle) throw new Error("No se encontró detalle de donación.");
      setDetalleDonacion(detalle);
      setMascotaParaDonar(mascota);
      setDonarModalVisible(true);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cargar el detalle de la donación.");
    }
  };

  const handleConfirmarDonacion = async (monto: number) => {
    const usuarioId = userSupabaseId || usuario?.id;

    if (!mascotaParaDonar?.casoId || !usuarioId) {
      toast.error("Debes iniciar sesión para donar.");
      return;
    }

    try {
      const data = await iniciarDonacion(
        {
          casoId: mascotaParaDonar.casoId,
          monto,
        },
        token ?? undefined
      );

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("No se pudo generar el link de pago.");
      }
    } catch (error) {
      console.error("Error al iniciar la donación:", error);
      toast.error("Ocurrió un error al iniciar la donación.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start py-10 px-4 bg-pink-50 min-h-screen">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
          Ayudá a una mascota en{" "}
          <span className="italic">situación crítica</span>
        </h1>
        <p className="text-gray-600 text-lg mb-6 text-center">
          Estos animales necesitan tu colaboración. Gracias por tu interés en
          ayudarlos.
        </p>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 max-w-md mx-auto mb-8">
          <div className="relative w-full max-w-xs">
            <select
              className="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as "perro" | "gato" | "")}
            >
              <option value="">Todos</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-5 h-5 text-pink-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="relative w-full max-w-xs">
            <select
              className="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={orden}
              onChange={(e) =>
                setOrden(e.target.value as "mas_reciente" | "mas_antiguo")
              }
            >
              <option value="mas_reciente">Más reciente</option>
              <option value="mas_antiguo">Más antiguo</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-5 h-5 text-pink-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {cargando && (
          <p className="text-center text-gray-500">Cargando casos...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!cargando && resultados.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No se encontraron casos.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {resultadosOrdenados.map((caso) => {
            const mascotaCompleta: Mascota = {
              ...caso.mascota,
              casoId: caso.id,
              tipo: caso.tipo.toLowerCase(),
              descripcion: caso.descripcion,
            };

            return (
              <MascotaCard
                key={caso.id}
                mascota={mascotaCompleta}
                onConocerHistoria={() => handleConocerHistoria(mascotaCompleta)}
                onAdoptar={() => handleDonar(mascotaCompleta)}
                modo="donacion"
              />
            );
          })}
        </div>
      </div>

      {/* Modal historia */}
      {mascotaSeleccionada && (
        <MascotaModal
          mascota={mascotaSeleccionada}
          visible={mostrandoHistoria}
          cargando={false}
          onClose={() => setMostrandoHistoria(false)}
          onAccion={() => handleDonar(mascotaSeleccionada)}
          modo="donacion"
        />
      )}

      {/* Modal de donación */}
      {donarModalVisible && detalleDonacion && mascotaParaDonar && (
        <DonarModal
          visible={donarModalVisible}
          onClose={() => setDonarModalVisible(false)}
          onConfirm={handleConfirmarDonacion}
          meta={detalleDonacion.metaDonacion}
          recaudado={detalleDonacion.estadoDonacion}
        />
      )}
    </div>
  );
}
