// /services/backendApi.ts
export const fetchConToken = async (token: string) => {
    console.log("Token a enviar: " + token);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/supabase/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error en el servidor");
  }

  return data;
};
