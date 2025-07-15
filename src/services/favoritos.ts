


export async function putAgregarAFavoritos( casoId: string, token?: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${casoId}/favoritos`
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
 

  const res = await fetch(url, { method: 'PUT', credentials: 'include', headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Error ${res.status}: ${text}`)
  }
  return res.json()
}



export async function getFavoritosPorUsuario(token?: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/favoritos/casos`;

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: 'GET',
    headers,
    credentials: token ? 'omit' : 'include', 
  });

  if (!res.ok) {
    throw new Error('Error al obtener los favoritos del usuario');
  }

  return res.json();
}

