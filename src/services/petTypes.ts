export async function fetchPetTypes() {
  const res = await fetch(
    "https://backend-hearts-paws-dev.onrender.com/mascotas/tipo"
  );

  if (!res.ok) throw new Error("Error al cargar tipos de mascota");

  const data = await res.json();
  return data;
}
