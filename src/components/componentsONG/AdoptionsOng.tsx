"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  getMascotasPorOng,
  getSolicitudesPorCaso,
  actualizarEstadoSolicitud,
  MascotaConSolicitudes,
} from "@/services/adoptionsOng";



export default function AdoptionsOng() {
  const [data, setData] = useState<MascotaConSolicitudes[]>([]);
  const [expandida, setExpandida] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const mascotas = await getMascotasPorOng();
        const solicitudesData = await getSolicitudesPorCaso();

        type Solicitud = MascotaConSolicitudes['solicitudes'][number];
        const solicitudesMap = new Map<string, Solicitud[]>();
        solicitudesData.forEach(({ mascota, solicitudes }) => {
          solicitudesMap.set(mascota.id, solicitudes);
        });

        const combinedData: MascotaConSolicitudes[] = mascotas.map((mascota) => ({
          mascota,
          solicitudes: solicitudesMap.get(mascota.id) || [],
        }));

        setData(combinedData);
      } catch (error) {
        console.error("Error al cargar datos", error);
        toast.error("Error al cargar datos");
      } finally {
        setCargando(false);
      }
    }

    fetchData();
  }, []);

  const toggleExpandir = (id: string) => {
    setExpandida((prev) => (prev === id ? null : id));
  };

  const handleEstadoSolicitud = async (
    mascotaId: string,
    solicitudId: string,
    nuevoEstado: "ACEPTADA" | "RECHAZADA"
  ) => {
    const mascota = data.find((m) => m.mascota.id === mascotaId);
    const casoAdopcionId = mascota?.mascota.casos?.[0]?.adopcion?.id;

    if (!casoAdopcionId) return toast.error("No se encontró caso de adopción");

    setLoading(solicitudId);

    try {
      await actualizarEstadoSolicitud(casoAdopcionId, solicitudId, nuevoEstado);
      toast.success(`Solicitud ${nuevoEstado.toLowerCase()} con éxito`);

      setData((prev) =>
  prev.map((m) => {
    if (m.mascota.id !== mascotaId) return m;

    if (nuevoEstado === "ACEPTADA") {
      return {
        ...m,
        solicitudes: m.solicitudes
          .filter((s) => s.id === solicitudId)
          .map((s) => ({ ...s, estado: "ACEPTADA" })), 
      };
    }

    return {
      ...m,
      solicitudes: m.solicitudes.map((s) =>
        s.id === solicitudId ? { ...s, estado: "RECHAZADA" } : s
      ),
    };
  })
);

    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar estado");
    } finally {
      setLoading(null);
    }
  };

  if (cargando) return <p className="p-6 text-center">⏳ Cargando tus solicitudes...</p>;

 return (
  <div className="bg-pink-50 min-h-screen p-12 flex justify-center">
    <div className="max-w-4xl w-full px-6 space-y-6">
      {data.every(({ solicitudes }) => solicitudes.length === 0) ? (
        <p className="text-center text-gray-600 text-lg mt-10">
          📭 No tienes solicitudes de adopción aún.
        </p>
      ) : (
        data.map(({ mascota, solicitudes }) => (
          <div key={mascota.id}>
            <button
              onClick={() => toggleExpandir(mascota.id)}
              className="flex items-center gap-4 p-4 bg-white border border-pink-200 rounded-2xl shadow-md w-full hover:bg-pink-100 transition"
            >
              <Image
                src={mascota.imagenes?.[0]?.url || "/placeholder.jpg"}
                alt={mascota.nombre}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-2 border-pink-400 object-cover"
              />
              <p className="text-pink-600 font-semibold text-xl">{mascota.nombre}</p>
              <span className="ml-auto text-pink-600 font-bold text-2xl select-none">
                {expandida === mascota.id ? "▲" : "▼"}
              </span>
            </button>

            {expandida === mascota.id && (
              <div className="mt-4 bg-white border border-pink-200 rounded-2xl shadow-md p-6 text-gray-800 space-y-4">
                {solicitudes.length > 0 ? (
                  solicitudes.map((sol) => (
                    <div key={sol.id} className="bg-pink-50 border border-pink-300 rounded-xl p-4">
                      <p className="font-semibold text-pink-600 mb-2">Solicitante: {sol.usuario.nombre}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <p><strong>Email:</strong> {sol.usuario.email}</p>
                        <p><strong>Teléfono:</strong> {sol.usuario.telefono}</p>
                        <p><strong>Tipo de Vivienda:</strong> {sol.tipoVivienda}</p>
                        <p><strong>Integrantes de la Familia:</strong> {sol.integrantesFlia}</p>
                        <p><strong>Hijos:</strong> {sol.hijos}</p>
                        <p><strong>¿Otras Mascotas?:</strong> {sol.hayOtrasMascotas}</p>
                        <p><strong>¿Puede cubrir gastos?:</strong> {sol.cubrirGastos}</p>
                        <p><strong>¿Puede alimentar y cuidar?:</strong> {sol.darAlimentoCuidados}</p>
                        <p><strong>¿Puede dar amor y ejercicio?:</strong> {sol.darAmorTiempoEj}</p>
                        <p><strong>¿Acepta devolución?:</strong> {sol.devolucionDeMascota}</p>
                        <p><strong>Declaración final:</strong> {sol.declaracionFinal}</p>
                      </div>
                      <p className="mt-2">
                        <strong>Estado:</strong>{" "}
                        <span className="capitalize font-semibold text-pink-600">{sol.estado}</span>
                      </p>

                      {sol.estado === "PENDIENTE" && (
                        <div className="flex gap-4 pt-4">
                          <button
                            onClick={() => handleEstadoSolicitud(mascota.id, sol.id, "ACEPTADA")}
                            disabled={loading === sol.id}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl shadow disabled:opacity-50"
                          >
                            {loading === sol.id ? "Procesando..." : "Aceptar"}
                          </button>
                          <button
                            onClick={() => handleEstadoSolicitud(mascota.id, sol.id, "RECHAZADA")}
                            disabled={loading === sol.id}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl shadow disabled:opacity-50"
                          >
                            {loading === sol.id ? "Procesando..." : "Rechazar"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No hay solicitudes para esta mascota.</p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);
}