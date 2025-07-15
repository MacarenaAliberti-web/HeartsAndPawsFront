

import { NuevaMascotaData } from "@/components/componentsong/NewPet";

// Crear mascota
export const createPet = async (body: NuevaMascotaData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas`, {
    method: "POST",
    credentials: "include",
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/${mascotaId}/imagenes`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al subir las imágenes");
};