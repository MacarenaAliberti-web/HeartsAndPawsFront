// services/donacion.ts

interface DonacionParams {
  usuarioId: string;
  casoId: string;
  monto: number;
}

export async function iniciarDonacion({ usuarioId, casoId, monto }: DonacionParams) {
  const params = new URLSearchParams({ usuarioId, casoId, monto: monto.toString() });
  const url = `${process.env.NEXT_PUBLIC_API_URL}/stripe/checkout?${params}`;

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) throw new Error(`Error al iniciar la donación: ${res.statusText}`);

  return res.json(); // espera { checkoutUrl: string }
}
