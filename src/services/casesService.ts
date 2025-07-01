

import { Caso } from "@/types/casos";

export async function getCasesByOng(): Promise<Caso[]> {
  const res = await fetch(
    "https://backend-hearts-paws-dev.onrender.com/casos/ong/mis-casos",
    { credentials: "include" }
  );

  if (!res.ok) {
    throw new Error("Error al cargar casos");
  }

  const data = await res.json();
  return data;
}
