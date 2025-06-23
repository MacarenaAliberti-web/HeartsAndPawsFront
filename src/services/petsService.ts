// src/services/petsService.ts

export const fetchPetsByOngId = async (ongId: string) => {
  const response = await fetch(`https://backend-hearts-paws-dev.onrender.com/mascotas/ong/${ongId}`);
  if (!response.ok) throw new Error("Error fetching pets");
  return response.json();
};
