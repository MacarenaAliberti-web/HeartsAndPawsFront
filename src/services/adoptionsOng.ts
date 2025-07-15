import { Mensaje } from "@/types/chat";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
}

export interface Solicitud {
  id: string;
  usuarioId: string;
  casoAdopcionId: string;
  estado: "PENDIENTE" | "ACEPTADA" | "RECHAZADA";
  tipoVivienda: string;
  integrantesFlia: number;
  hijos: number;
  hayOtrasMascotas: string;
  descripcionOtrasMascotas: string;
  cubrirGastos: string;
  darAlimentoCuidados: string;
  darAmorTiempoEj: string;
  devolucionDeMascota: string;
  siNoPodesCuidarla: string;
  declaracionFinal: string;
  usuario: Usuario;
}

export interface Mascota {
  id: string;
  nombre: string;
  descripcion: string;
  edad: number;
  imagenes?: { url: string }[];
  casos?: { adopcion?: { id: string } }[];
}

export interface MascotaConSolicitudes {
  mascota: Mascota;
  solicitudes: Solicitud[];
}

export async function getMascotasPorOng(): Promise<Mascota[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/mascotas-por-ong-adopcion/`,{
    method: 'GET',
    credentials: 'include',
  
  });
  if (!res.ok) throw new Error('Error al obtener mascotas');
  return res.json();
}

export async function getSolicitudesPorCaso(): Promise<MascotaConSolicitudes[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitud-adoptar/solicitudesDeCadaAdopcion`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Error al obtener solicitudes");
  return res.json(); // ✅ ya devuelve [{ mascota, solicitudes }]
}


export async function actualizarEstadoSolicitud(
  idDelCasoAdopcion: string,
  idDeSolicitudAceptada: string,
  estadoNuevo: "PENDIENTE" | "ACEPTADA" | "RECHAZADA"
): Promise<Mensaje> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitud-adoptar`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idDelCasoAdopcion,
      idDeSolicitudAceptada,
      estadoNuevo,
    }),
  });

  if (!res.ok) {
    throw new Error("Error al actualizar estado de la solicitud");
  }

  const updated: Mensaje = await res.json();
  return updated;
}




// export interface Usuario {
//   id: string;
//   nombre: string;
//   email: string;
//   telefono: string;
// }

// export interface Solicitud {
//   id: string;
//   usuarioId: string;
//   casoAdopcionId: string;
//   estado: string;
//   tipoVivienda: string;
//   integrantesFlia: number;
//   hijos: number;
//   hayOtrasMascotas: string;
//   descripcionOtrasMascotas: string;
//   cubrirGastos: string;
//   darAlimentoCuidados: string;
//   darAmorTiempoEj: string;
//   devolucionDeMascota: string;
//   siNoPodesCuidarla: string;
//   declaracionFinal: string;
//   usuario: Usuario;
// }

// export interface Mascota {
//   id: string;
//   nombre: string;
//   imagenes?: { url: string }[];
//   casos?: { adopcion?: { id: string } }[];
// }
// export async function getMascotasPorOng(ongId: string): Promise<Mascota[]> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/mascotas-por-ong-adopcion/`,{
//     method: 'GET',
//     credentials: 'include',
  
//   });
//   if (!res.ok) throw new Error('Error al obtener mascotas');
//   return res.json();
// }

// // export async function getSolicitudesPorCaso(casoId: string): Promise<Solicitud[]> {
// //   if (!casoId) throw new Error("ID de adopción inválido");
// //   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitud-adoptar/solicitudesDeCadaAdopcion`,{
// //     method: 'GET',
// //     credentials: 'include',
// //   });
// //   if (!res.ok) throw new Error('Error al obtener solicitudes');
// //   const data = await res.json();

// //   return data; 
// // }

// export async function getSolicitudesPorCaso(casoId?: string): Promise<Solicitud[]> {
//   // No usas casoId porque el backend te da todo
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitud-adoptar/solicitudesDeCadaAdopcion`, {
//     method: 'GET',
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error('Error al obtener solicitudes');
//   return res.json();
// }

// export async function actualizarEstadoSolicitud(
//   idDelCasoAdopcion: string,
//   idDeSolicitudAceptada: string,
//   estadoNuevo: "PENDIENTE" | "ACEPTADA" | "RECHAZADA"
// ): Promise<any> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitud-adoptar`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       idDelCasoAdopcion,
//       idDeSolicitudAceptada,
//       estadoNuevo,
//     }),
//   });

//   if (!res.ok) {
//     throw new Error("Error al actualizar estado de la solicitud");
//   }

//   return res.json();
// }
