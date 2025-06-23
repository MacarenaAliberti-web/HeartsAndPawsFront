// src/services/mascotas.ts

// Crear mascota
export const createPet = async (body: any) => {
  const res = await fetch("https://backend-hearts-paws-dev.onrender.com/mascotas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Error al crear la mascota");

  return await res.json();
};

// Subir imágenes
export const petImages = async (mascotaId: string, imagenes: FileList) => {
  const formData = new FormData();
  Array.from(imagenes).forEach((img) => formData.append("imagenes", img));

  const res = await fetch(`https://backend-hearts-paws-dev.onrender.com/mascotas/${mascotaId}/imagenes`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al subir las imágenes");
};
