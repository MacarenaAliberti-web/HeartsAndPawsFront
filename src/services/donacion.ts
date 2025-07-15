

import { DetalleDonacion } from "@/types/detalledonacion";

interface DonacionParams {
  casoId: string;
  monto: number;
}

export async function iniciarDonacion(
  { casoId, monto }: DonacionParams,
  token?: string
) {
 

  
  const url = `${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout?casoId=${casoId}&monto=${monto}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    method: 'GET',
    headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    fetchOptions.credentials = 'omit';
  } else {
    fetchOptions.credentials = 'include';
  }

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    throw new Error(`Error al iniciar la donación: ${res.statusText}`);
  }

  return res.json();
}

// Meta Donacion
export async function getDetalleDonacionPorCaso(
  CasoId: string,
  token?: string
): Promise<DetalleDonacion | null> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/donacion/detalleDonacion/${CasoId}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    method: 'GET',
    headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    fetchOptions.credentials = 'omit';
  } else {
    fetchOptions.credentials = 'include';
  }

  const res = await fetch(url, fetchOptions);
 

  if (!res.ok) {
    throw new Error('Error al obtener detalle de donación');
  }

  const data: DetalleDonacion[] = await res.json();
   console.log('soy la respuesta del backend: '+JSON.stringify(data));
  return data[0] || null;
}