
export const getMyOng = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizaciones/me`, {
      method: "GET",
      credentials: "include", // incluye cookies
    });

    if (!res.ok) throw new Error("No se pudo obtener la ONG autenticada");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error en getMyOng:", error);
    throw error;
  }
};
