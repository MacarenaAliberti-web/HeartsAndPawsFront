"use client";

import { useState, useEffect } from "react";
import { useOngAuth } from "@/context/OngAuthContext";
import {
  getMascotasPorOng,
  getSolicitudesPorCaso,
  actualizarEstadoSolicitud,
  Mascota,
  Solicitud,
} from "@/services/adoptionsOng";
import toast from "react-hot-toast";

export default function AdoptionsOng() {
  const { ong } = useOngAuth();

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [solicitudesPorMascota, setSolicitudesPorMascota] = useState<Record<string, Solicitud[]>>({});
  const [abiertaId, setAbiertaId] = useState<string | null>(null);
  const [loadingActualizacion, setLoadingActualizacion] = useState<string | null>(null);

  useEffect(() => {
    if (!ong?.id) return;

    getMascotasPorOng(ong.id)
      .then((data) => {
        console.log("Mascotas recibidas:", data);
        setMascotas(data);
      })
      .catch((error) => {
        console.error("Error al obtener mascotas:", error);
      });
  }, [ong?.id]);

  const toggleSolicitudes = async (mascota: Mascota) => {
    if (abiertaId === mascota.id) {
      setAbiertaId(null);
      return;
    }

    const casoAdopcionId = mascota.casos?.[0]?.adopcion?.id;
    if (!casoAdopcionId) {
      console.warn("No se encontró caso de adopción para la mascota", mascota.id);
      setSolicitudesPorMascota((prev) => ({ ...prev, [mascota.id]: [] }));
      setAbiertaId(mascota.id);
      return;
    }

    if (!solicitudesPorMascota[mascota.id]) {
      try {
        const solicitudes = await getSolicitudesPorCaso(casoAdopcionId);
        console.log(`Solicitudes para mascota ${mascota.nombre}:`, solicitudes);
        setSolicitudesPorMascota((prev) => ({
          ...prev,
          [mascota.id]: solicitudes,
        }));
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        setSolicitudesPorMascota((prev) => ({ ...prev, [mascota.id]: [] }));
      }
    }

    setAbiertaId(mascota.id);
  };

 const manejarEstadoSolicitud = async (
  solicitudId: string,
  nuevoEstado: "PENDIENTE" | "ACEPTADA" | "RECHAZADA",
  mascotaId: string
) => {
  setLoadingActualizacion(solicitudId);
  try {
    const casoAdopcionId = mascotas.find((m) => m.id === mascotaId)?.casos?.[0]?.adopcion?.id;
    if (!casoAdopcionId) throw new Error("No se encontró el caso de adopción");

    await actualizarEstadoSolicitud(casoAdopcionId, solicitudId, nuevoEstado);

    setSolicitudesPorMascota((prev) => ({
      ...prev,
      [mascotaId]: prev[mascotaId].map((sol) =>
        sol.id === solicitudId ? { ...sol, estado: nuevoEstado } : sol
      ),
    }));

    toast.success(`Solicitud ${nuevoEstado.toLowerCase()} con éxito.`);
  } catch (error) {
    console.error("Error al actualizar estado de la solicitud", error);
    toast.error("Error al actualizar la solicitud.");
  } finally {
    setLoadingActualizacion(null);
  }
};

  return (
    <div className="bg-pink-50 min-h-screen p-6 flex justify-center">
      <div className="max-w-3xl w-full space-y-6">
        {mascotas.map((mascota) => (
          <div key={mascota.id}>
            <button
              onClick={() => toggleSolicitudes(mascota)}
              className="flex items-center gap-4 p-4 bg-white border border-pink-200 rounded-2xl shadow-md w-full hover:bg-pink-100"
            >
              <img
                src={mascota.imagenes?.[0]?.url || "/placeholder.jpg"}
                alt={mascota.nombre}
                className="w-20 h-20 rounded-full border-2 border-pink-400 object-cover"
              />
              <p className="text-pink-600 font-semibold text-xl">{mascota.nombre}</p>
              <span className="ml-auto text-pink-600 font-bold text-2xl select-none">
                {abiertaId === mascota.id ? "▲" : "▼"}
              </span>
            </button>

            {abiertaId === mascota.id && (
              <div className="mt-4 bg-white border border-pink-200 rounded-2xl shadow-md p-6 text-gray-800 space-y-4">
                {solicitudesPorMascota[mascota.id]?.length ? (
                  solicitudesPorMascota[mascota.id].map((sol) => (
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
                            disabled={loadingActualizacion === sol.id}
                            onClick={() => manejarEstadoSolicitud(sol.id, "ACEPTADA", mascota.id)}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl shadow disabled:opacity-50"
                          >
                            {loadingActualizacion === sol.id ? "Procesando..." : "Aceptar"}
                          </button>
                          <button
                            disabled={loadingActualizacion === sol.id}
                            onClick={() => manejarEstadoSolicitud(sol.id, "RECHAZADA", mascota.id)}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl shadow disabled:opacity-50"
                          >
                            {loadingActualizacion === sol.id ? "Procesando..." : "Rechazar"}
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
        ))}
      </div>
    </div>
  );
}
