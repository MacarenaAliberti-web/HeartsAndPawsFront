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

const ONG_ID = "idDeTuOng"; // reemplazá con el ID real de tu ONG o consíguila desde contexto

export default function AdoptionsOng() {
  const [data, setData] = useState<MascotaConSolicitudes[]>([]);
  const [expandida, setExpandida] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const mascotas = await getMascotasPorOng(ONG_ID);
        const solicitudesData = await getSolicitudesPorCaso();

        const solicitudesMap = new Map<string, any[]>();
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
          .map((s) => ({ ...s, estado: "ACEPTADA" })), // solo queda la aceptada
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

  if (cargando) return <p className="p-6 text-center">Cargando datos...</p>;

  return (
    <div className="bg-pink-50 min-h-screen p-12 flex justify-center">
      <div className="max-w-4xl w-full px-6 space-y-6">
        {data.map(({ mascota, solicitudes }) => (
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
        ))}
      </div>
    </div>
  );
}






// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import toast from "react-hot-toast";
// import { getSolicitudesPorCaso, actualizarEstadoSolicitud, MascotaConSolicitudes } from "@/services/adoptionsOng";


// export default function AdoptionsOng() {
//   const [data, setData] = useState<MascotaConSolicitudes[]>([]);
//   const [expandida, setExpandida] = useState<string | null>(null);
//   const [loading, setLoading] = useState<string | null>(null);

//   useEffect(() => {
//     getSolicitudesPorCaso()
//       .then(setData)
//       .catch((err) => console.error("Error al cargar datos", err));
//   }, []);

//   const toggleExpandir = (id: string) => {
//     setExpandida((prev) => (prev === id ? null : id));
//   };

//   const handleEstadoSolicitud = async (
//     mascotaId: string,
//     solicitudId: string,
//     nuevoEstado: "ACEPTADA" | "RECHAZADA"
//   ) => {
//     const mascota = data.find((m) => m.mascota.id === mascotaId);
//     const casoAdopcionId = mascota?.mascota.casos?.[0]?.adopcion?.id;
//     if (!casoAdopcionId) return toast.error("No se encontró caso de adopción");

//     setLoading(solicitudId);

//     try {
//       await actualizarEstadoSolicitud(casoAdopcionId, solicitudId, nuevoEstado);
//       toast.success(`Solicitud ${nuevoEstado.toLowerCase()} con éxito`);

//       setData((prev) =>
//         prev.map((m) =>
//           m.mascota.id === mascotaId
//             ? {
//                 ...m,
//                 solicitudes: m.solicitudes.map((s) =>
//                   s.id === solicitudId ? { ...s, estado: nuevoEstado } : s
//                 ),
//               }
//             : m
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       toast.error("Error al actualizar estado");
//     } finally {
//       setLoading(null);
//     }
//   };

//   return (
//     <div className="bg-pink-50 min-h-screen p-12 flex justify-center">
//       <div className="max-w-4xl w-full px-6 space-y-6">
//         {data.map(({ mascota, solicitudes }) => (
//           <div key={mascota.id}>
//             <button
//               onClick={() => toggleExpandir(mascota.id)}
//               className="flex items-center gap-4 p-4 bg-white border border-pink-200 rounded-2xl shadow-md w-full hover:bg-pink-100 transition"
//             >
//               <Image
//                 src={mascota.imagenes?.[0]?.url || "/placeholder.jpg"}
//                 alt={mascota.nombre}
//                 width={80}
//                 height={80}
//                 className="w-20 h-20 rounded-full border-2 border-pink-400 object-cover"
//               />
//               <p className="text-pink-600 font-semibold text-xl">{mascota.nombre}</p>
//               <span className="ml-auto text-pink-600 font-bold text-2xl select-none">
//                 {expandida === mascota.id ? "▲" : "▼"}
//               </span>
//             </button>

//             {expandida === mascota.id && (
//               <div className="mt-4 bg-white border border-pink-200 rounded-2xl shadow-md p-6 text-gray-800 space-y-4">
//                 {solicitudes.length > 0 ? (
//                   solicitudes.map((sol) => (
//                     <div key={sol.id} className="bg-pink-50 border border-pink-300 rounded-xl p-4">
//                       <p className="font-semibold text-pink-600 mb-2">Solicitante: {sol.usuario.nombre}</p>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
//                         <p><strong>Email:</strong> {sol.usuario.email}</p>
//                         <p><strong>Teléfono:</strong> {sol.usuario.telefono}</p>
//                         <p><strong>Tipo de Vivienda:</strong> {sol.tipoVivienda}</p>
//                         <p><strong>Integrantes de la Familia:</strong> {sol.integrantesFlia}</p>
//                         <p><strong>Hijos:</strong> {sol.hijos}</p>
//                         <p><strong>¿Otras Mascotas?:</strong> {sol.hayOtrasMascotas}</p>
//                         <p><strong>¿Puede cubrir gastos?:</strong> {sol.cubrirGastos}</p>
//                         <p><strong>¿Puede alimentar y cuidar?:</strong> {sol.darAlimentoCuidados}</p>
//                         <p><strong>¿Puede dar amor y ejercicio?:</strong> {sol.darAmorTiempoEj}</p>
//                         <p><strong>¿Acepta devolución?:</strong> {sol.devolucionDeMascota}</p>
//                         <p><strong>Declaración final:</strong> {sol.declaracionFinal}</p>
//                       </div>
//                       <p className="mt-2">
//                         <strong>Estado:</strong>{" "}
//                         <span className="capitalize font-semibold text-pink-600">{sol.estado}</span>
//                       </p>

//                       {sol.estado === "PENDIENTE" && (
//                         <div className="flex gap-4 pt-4">
//                           <button
//                             onClick={() => handleEstadoSolicitud(mascota.id, sol.id, "ACEPTADA")}
//                             disabled={loading === sol.id}
//                             className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl shadow disabled:opacity-50"
//                           >
//                             {loading === sol.id ? "Procesando..." : "Aceptar"}
//                           </button>
//                           <button
//                             onClick={() => handleEstadoSolicitud(mascota.id, sol.id, "RECHAZADA")}
//                             disabled={loading === sol.id}
//                             className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl shadow disabled:opacity-50"
//                           >
//                             {loading === sol.id ? "Procesando..." : "Rechazar"}
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <p>No hay solicitudes para esta mascota.</p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }





// "use client";

// import { useEffect, useState } from "react";
// import { getSolicitudesPorCaso, MascotaConSolicitudes } from "@/services/adoptionsOng";
// import Image from "next/image";


// export default function AdoptionsOng() {
//   const [data, setData] = useState<MascotaConSolicitudes[]>([]);
//   const [expandida, setExpandida] = useState<string | null>(null);

//   useEffect(() => {
//     getSolicitudesPorCaso()
//       .then(setData)
//       .catch((err) => console.error("Error al cargar datos", err));
//   }, []);

//   const toggleExpandir = (id: string) => {
//     setExpandida(prev => (prev === id ? null : id));
//   };

//   return (
//     <div className="bg-pink-50 min-h-screen p-6 flex justify-center">
//       <div className="max-w-3xl w-full space-y-6">
//         {data.map(({ mascota, solicitudes }) => (
//           <div key={mascota.id}>
//             <button
//               onClick={() => toggleExpandir(mascota.id)}
//               className="flex items-center gap-4 p-4 bg-white border border-pink-200 rounded-2xl shadow-md w-full hover:bg-pink-100 transition"
//             >
//               <Image
//                 src={mascota.imagenes?.[0]?.url || "/placeholder.jpg"}
//                 alt={mascota.nombre}
//                 width={80}
//                 height={80}
//                 className="w-20 h-20 rounded-full border-2 border-pink-400 object-cover"
//               />
//               <p className="text-pink-600 font-semibold text-xl">{mascota.nombre}</p>
//               <span className="ml-auto text-pink-600 font-bold text-2xl select-none">
//                 {expandida === mascota.id ? "▲" : "▼"}
//               </span>
//             </button>

//             {expandida === mascota.id && (
//               <div className="mt-4 bg-white border border-pink-200 rounded-2xl shadow-md p-6 text-gray-800 space-y-4">
//                 {solicitudes.length > 0 ? (
//                   solicitudes.map((sol) => (
//                     <div key={sol.id} className="bg-pink-50 border border-pink-300 rounded-xl p-4">
//                       <p className="font-semibold text-pink-600 mb-2">Solicitante: {sol.usuario.nombre}</p>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
//                         <p><strong>Email:</strong> {sol.usuario.email}</p>
//                         <p><strong>Teléfono:</strong> {sol.usuario.telefono}</p>
//                         <p><strong>Tipo de Vivienda:</strong> {sol.tipoVivienda}</p>
//                         <p><strong>Integrantes de la Familia:</strong> {sol.integrantesFlia}</p>
//                         <p><strong>Hijos:</strong> {sol.hijos}</p>
//                         <p><strong>¿Otras Mascotas?:</strong> {sol.hayOtrasMascotas}</p>
//                         <p><strong>¿Puede cubrir gastos?:</strong> {sol.cubrirGastos}</p>
//                         <p><strong>¿Puede alimentar y cuidar?:</strong> {sol.darAlimentoCuidados}</p>
//                         <p><strong>¿Puede dar amor y ejercicio?:</strong> {sol.darAmorTiempoEj}</p>
//                         <p><strong>¿Acepta devolución?:</strong> {sol.devolucionDeMascota}</p>
//                         <p><strong>Declaración final:</strong> {sol.declaracionFinal}</p>
//                       </div>
//                       <p className="mt-2">
//                         <strong>Estado:</strong>{" "}
//                         <span className="capitalize font-semibold text-pink-600">{sol.estado}</span>
//                       </p>
//                       {/* Aquí podrías agregar botones si deseas aceptar/rechazar */}
//                     </div>
//                   ))
//                 ) : (
//                   <p>No hay solicitudes para esta mascota.</p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useEffect, useState } from "react";
// import { getSolicitudesPorCaso, MascotaConSolicitudes } from "@/services/adoptionsOng";
// import Image from "next/image";


// export default function AdoptionsOng() {
//   const [data, setData] = useState<MascotaConSolicitudes[]>([]);
//   const [expandida, setExpandida] = useState<string | null>(null);

//   useEffect(() => {
//     getSolicitudesPorCaso()
//       .then(setData)
//       .catch((err) => console.error("Error al cargar datos", err));
//   }, []);

//   const toggleExpandir = (id: string) => {
//     setExpandida(prev => (prev === id ? null : id));
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {data.map(({ mascota, solicitudes }) => (
//         <div key={mascota.id} className="border border-pink-300 rounded-2xl p-4 shadow transition-all duration-300">
//           {/* Tarjeta mascota */}
//           <div
//             onClick={() => toggleExpandir(mascota.id)}
//             className="flex gap-4 items-center cursor-pointer hover:bg-pink-100 p-2 rounded-xl"
//           >
//             <Image
//               src={mascota.imagenes?.[0]?.url || "/placeholder.jpg"}
//               alt={mascota.nombre}
//               width={100}
//               height={100}
//               className="rounded-xl object-cover w-24 h-24"
//             />
//             <div>
//               <h2 className="text-xl font-bold text-pink-600">{mascota.nombre}</h2>
//               <p className="text-gray-600">{mascota.descripcion}</p>
//             </div>
//           </div>

//           {/* Solicitudes */}
//           {expandida === mascota.id && (
//             <div className="mt-4 space-y-4">
//               {solicitudes.length === 0 ? (
//                 <p className="text-gray-500">No hay solicitudes aún.</p>
//               ) : (
//                 solicitudes.map((s) => (
//                   <div key={s.id} className="border p-3 rounded-lg bg-gray-50">
//                     <p><strong>Postulante:</strong> {s.usuario.nombre} ({s.usuario.email})</p>
//                     <p><strong>Teléfono:</strong> {s.usuario.telefono}</p>
//                     <p><strong>Vivienda:</strong> {s.tipoVivienda}</p>
//                     <p><strong>Integrantes:</strong> {s.integrantesFlia}</p>
//                     <p><strong>Hijos:</strong> {s.hijos}</p>
//                     <p><strong>Otras mascotas:</strong> {s.hayOtrasMascotas}</p>
//                     <p><strong>Descripción:</strong> {s.descripcionOtrasMascotas || "N/A"}</p>
//                     <p><strong>Estado:</strong> {s.estado}</p>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import { useOngAuth } from "@/context/OngAuthContext";
// import {
//   getMascotasPorOng,
//   getSolicitudesPorCaso,
//   actualizarEstadoSolicitud,
//   Mascota,
//   Solicitud,
// } from "@/services/adoptionsOng";
// import toast from "react-hot-toast";

// export default function AdoptionsOng() {
//   const { ong } = useOngAuth();

//   const [mascotas, setMascotas] = useState<Mascota[]>([]);
//   const [solicitudesPorMascota, setSolicitudesPorMascota] = useState<Record<string, Solicitud[]>>({});
//   const [abiertaId, setAbiertaId] = useState<string | null>(null);
//   const [loadingActualizacion, setLoadingActualizacion] = useState<string | null>(null);

//   useEffect(() => {
//     if (!ong?.id) return;

//     getMascotasPorOng(ong.id)
//       .then((data) => {
//         console.log("Mascotas recibidas:", data);
//         setMascotas(data);
//       })
//       .catch((error) => {
//         console.error("Error al obtener mascotas:", error);
//       });
//   }, [ong?.id]);

//   const toggleSolicitudes = async (mascota: Mascota) => {
//     if (abiertaId === mascota.id) {
//       setAbiertaId(null);
//       return;
//     }

//     const casoAdopcionId = mascota.casos?.[0]?.adopcion?.id;
//     if (!casoAdopcionId) {
//       console.warn("No se encontró caso de adopción para la mascota", mascota.id);
//       setSolicitudesPorMascota((prev) => ({ ...prev, [mascota.id]: [] }));
//       setAbiertaId(mascota.id);
//       return;
//     }

//     if (!solicitudesPorMascota[mascota.id]) {
//       try {
//         const solicitudes = await getSolicitudesPorCaso(casoAdopcionId);
//         console.log(`Solicitudes para mascota ${mascota.nombre}:`, solicitudes);
//         setSolicitudesPorMascota((prev) => ({
//           ...prev,
//           [mascota.id]: solicitudes,
//         }));
//       } catch (error) {
//         console.error("Error al obtener solicitudes:", error);
//         setSolicitudesPorMascota((prev) => ({ ...prev, [mascota.id]: [] }));
//       }
//     }

//     setAbiertaId(mascota.id);
//   };

//  const manejarEstadoSolicitud = async (
//   solicitudId: string,
//   nuevoEstado: "PENDIENTE" | "ACEPTADA" | "RECHAZADA",
//   mascotaId: string
// ) => {
//   setLoadingActualizacion(solicitudId);
//   try {
//     const casoAdopcionId = mascotas.find((m) => m.id === mascotaId)?.casos?.[0]?.adopcion?.id;
//     if (!casoAdopcionId) throw new Error("No se encontró el caso de adopción");

//     await actualizarEstadoSolicitud(casoAdopcionId, solicitudId, nuevoEstado);

//     setSolicitudesPorMascota((prev) => ({
//       ...prev,
//       [mascotaId]: prev[mascotaId].map((sol) =>
//         sol.id === solicitudId ? { ...sol, estado: nuevoEstado } : sol
//       ),
//     }));

//     toast.success(`Solicitud ${nuevoEstado.toLowerCase()} con éxito.`);
//   } catch (error) {
//     console.error("Error al actualizar estado de la solicitud", error);
//     toast.error("Error al actualizar la solicitud.");
//   } finally {
//     setLoadingActualizacion(null);
//   }
// };

//   return (
//     <div className="bg-pink-50 min-h-screen p-6 flex justify-center">
//       <div className="max-w-3xl w-full space-y-6">
//         {mascotas.map((mascota) => (
//           <div key={mascota.id}>
//             <button
//               onClick={() => toggleSolicitudes(mascota)}
//               className="flex items-center gap-4 p-4 bg-white border border-pink-200 rounded-2xl shadow-md w-full hover:bg-pink-100"
//             >
//               <img
//                 src={mascota.imagenes?.[0]?.url || "/placeholder.jpg"}
//                 alt={mascota.nombre}
//                 className="w-20 h-20 rounded-full border-2 border-pink-400 object-cover"
//               />
//               <p className="text-pink-600 font-semibold text-xl">{mascota.nombre}</p>
//               <span className="ml-auto text-pink-600 font-bold text-2xl select-none">
//                 {abiertaId === mascota.id ? "▲" : "▼"}
//               </span>
//             </button>

//             {abiertaId === mascota.id && (
//               <div className="mt-4 bg-white border border-pink-200 rounded-2xl shadow-md p-6 text-gray-800 space-y-4">
//                 {solicitudesPorMascota[mascota.id]?.length ? (
//                   solicitudesPorMascota[mascota.id].map((sol) => (
//                     <div key={sol.id} className="bg-pink-50 border border-pink-300 rounded-xl p-4">
//                       <p className="font-semibold text-pink-600 mb-2">Solicitante: {sol.usuario.nombre}</p>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
//                         <p><strong>Email:</strong> {sol.usuario.email}</p>
//                         <p><strong>Teléfono:</strong> {sol.usuario.telefono}</p>
//                         <p><strong>Tipo de Vivienda:</strong> {sol.tipoVivienda}</p>
//                         <p><strong>Integrantes de la Familia:</strong> {sol.integrantesFlia}</p>
//                         <p><strong>Hijos:</strong> {sol.hijos}</p>
//                         <p><strong>¿Otras Mascotas?:</strong> {sol.hayOtrasMascotas}</p>
//                         <p><strong>¿Puede cubrir gastos?:</strong> {sol.cubrirGastos}</p>
//                         <p><strong>¿Puede alimentar y cuidar?:</strong> {sol.darAlimentoCuidados}</p>
//                         <p><strong>¿Puede dar amor y ejercicio?:</strong> {sol.darAmorTiempoEj}</p>
//                         <p><strong>¿Acepta devolución?:</strong> {sol.devolucionDeMascota}</p>
//                         <p><strong>Declaración final:</strong> {sol.declaracionFinal}</p>
//                       </div>
//                       <p className="mt-2">
//                         <strong>Estado:</strong>{" "}
//                         <span className="capitalize font-semibold text-pink-600">{sol.estado}</span>
//                       </p>
//                       {sol.estado === "PENDIENTE" && (
//                         <div className="flex gap-4 pt-4">
//                           <button
//                             disabled={loadingActualizacion === sol.id}
//                             onClick={() => manejarEstadoSolicitud(sol.id, "ACEPTADA", mascota.id)}
//                             className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl shadow disabled:opacity-50"
//                           >
//                             {loadingActualizacion === sol.id ? "Procesando..." : "Aceptar"}
//                           </button>
//                           <button
//                             disabled={loadingActualizacion === sol.id}
//                             onClick={() => manejarEstadoSolicitud(sol.id, "RECHAZADA", mascota.id)}
//                             className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl shadow disabled:opacity-50"
//                           >
//                             {loadingActualizacion === sol.id ? "Procesando..." : "Rechazar"}
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <p>No hay solicitudes para esta mascota.</p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
