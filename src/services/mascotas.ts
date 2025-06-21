export async function getMascotasEnAdopcion() {
  // Trae *todos* los casos sin filtro
  const url = `${process.env.NEXT_PUBLIC_API_URL}/casos/adopcion`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Error al obtener mascotas en adopción')
  }

  return res.json()
}

export async function getMascotasFiltradas({ tipo = '' }: { tipo?: string } = {}) {
  // Solo permite filtrar por tipo ('perro' o 'gato')
  const params = new URLSearchParams()
  if (tipo) params.append('tipo', tipo)

  const url = `${process.env.NEXT_PUBLIC_API_URL}/casos/adopcion/buscar?${params.toString()}`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Error al obtener mascotas filtradas')
  }

  return res.json()
}

export async function getMascotaById(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/${id}`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) throw new Error('Error al obtener la mascota')
  return res.json()
}

export async function adoptarMascota(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adopcion/${id}`, {
    method: 'POST',
    credentials: 'include',
  })

  if (res.status === 401) {
    throw new Error('No autorizado')
  }

  if (!res.ok) {
    throw new Error('Error al procesar la adopción')
  }

  return res.json()
}
