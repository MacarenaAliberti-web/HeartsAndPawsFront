export async function getMisSolicitudesDeAdopcion() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/mis-solicitudes`;

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include', // Esto enviará la cookie automáticamente
  });

  if (!res.ok) {
    throw new Error('Error al obtener tus solicitudes de adopción');
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [data]; // por si la API devuelve uno solo
}


export async function getMisDonaciones() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/mis-donaciones`;

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Error al obtener tus donaciones');
  }

  return res.json();
}
