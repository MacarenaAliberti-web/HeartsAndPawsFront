// src/services/petsService.ts

export const fetchPetsByOngId = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/ong`,{
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) throw new Error("Error fetching pets");
  return response.json();
};
