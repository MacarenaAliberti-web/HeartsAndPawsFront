
export const fetchConToken = async (token: string) => {
  console.log("fetch: Enviando access_token al backend:", token);


  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/supabase/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, 
      "Content-Type": "application/json",
    },

  });
   console.log("Status:", res.status);
  console.log("Headers:", [...res.headers.entries()]);

  if (!res.ok) {
    throw new Error("Error al sincronizar token");
  }

  const data = await res.json();
  return data;
};
