export async function fetchPetTypes() {
  const res = await fetch(
  ` ${process.env.NEXT_PUBLIC_API_URL}/mascotas/tipo`
  );

  if (!res.ok) throw new Error("Error al cargar tipos de mascota");

  const data = await res.json();
  return data;
}
