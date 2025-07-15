export async function getMisSolicitudesDeAdopcion(token?: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/mis-solicitudes`;

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
    throw new Error('Error al obtener tus solicitudes de adopción');
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [data]; 
}

export async function getMisDonaciones(token?: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/mis-donaciones`;

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
    throw new Error('Error al obtener tus donaciones');
  }

  return res.json();
}
