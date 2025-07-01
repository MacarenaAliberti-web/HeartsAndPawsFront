import { CasoBody } from "@/types/formsOng";

export const createCase = async (body: CasoBody) => {
  const res = await fetch("https://backend-hearts-paws-dev.onrender.com/casos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Error al crear el caso");
  return await res.json();
};
