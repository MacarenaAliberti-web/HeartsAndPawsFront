// services/favoritos.ts

export async function putAgregarAFavoritos(userId: string, casoId: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userId}/favoritos/${casoId}`

  const res = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error('Error al agregar a favoritos')
  }

  return res.json()
}

export async function getFavoritosPorUsuario(userId: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/favoritos/casos/${userId}`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Error al obtener los favoritos del usuario')
  }

  return res.json()
}
