import { CasoBody } from "@/types/formsOng";

export const createCase = async (body: CasoBody) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/casos`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Error al crear el caso");
  return await res.json();
};
