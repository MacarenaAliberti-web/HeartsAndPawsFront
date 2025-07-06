export interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

 export interface Mascota {
  id: string;
  nombre: string;
}

export interface Donacion {
  id: string;
  usuario?: Usuario | null;
  monto: number;
  fecha: string;
  estadoPago: string;
  mascota?: Mascota | null;
}

export async function getDonacionesPorOng(ongId: string): Promise<Donacion[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donacion/ong`,{
    method: 'GET',
    credentials: 'include'});
  if (!res.ok) throw new Error("Error al obtener donaciones");
  return res.json();
}

// export async function getDonacionesPorOng(ongId: string) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donacion/ong/${ongId}`);
//   if (!res.ok) throw new Error("Error al obtener donaciones");
//   return res.json();
// }
