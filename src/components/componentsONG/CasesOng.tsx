"use client";

import { useState, useEffect } from "react";
import CasoCard from "./CasoCard";
import { Caso } from "@/types/casos";
import { useOngAuth } from "@/context/OngAuthContext";
import { getCasesByOng } from "@/services/casesService";

export default function CasesOng() {
  const { ong } = useOngAuth();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const [tipo, setTipo] = useState<"perro" | "gato" | "">("");
  // const [orden, setOrden] = useState<"mas_reciente" | "mas_antiguo">(
  //   "mas_reciente"
  // );

  useEffect(() => {
    if (!ong) return;

    const fetchCasos = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getCasesByOng()
        setCasos(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCasos();
  }, [ong]);

  return (
    <div className="flex flex-col items-center justify-start py-10 px-4 bg-pink-50 min-h-screen">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
          Mis casos publicados
        </h1>
        <p className="text-gray-600 text-lg mb-6 text-center">
          Acá podés ver todos los casos que registraste como ONG.
        </p>

        {/* <div className="flex flex-col sm:flex-row sm:justify-center gap-4 max-w-md mx-auto mb-8">
          <div className="relative w-full max-w-xs">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as "perro" | "gato" | "")}
              className="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Filtrar por tipo de mascota"
            >
              <option value="">Todos</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-5 h-5 text-pink-600" />
            </div>
          </div>

          <div className="relative w-full max-w-xs">
            <select
              value={orden}
              onChange={(e) =>
                setOrden(e.target.value as "mas_reciente" | "mas_antiguo")
              }
              className="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              aria-label="Ordenar mascotas"
            >
              <option value="mas_reciente">Más reciente</option>
              <option value="mas_antiguo">Más antiguo</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-5 h-5 text-pink-600" />
            </div>
          </div>
        </div> */}

        {loading && (
          <p className="text-center text-gray-500">Cargando casos...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && casos.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No tenés casos publicados aún.
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-8 mt-6">
          {casos.map((caso) => (
            <CasoCard key={caso.id} caso={caso} />
          ))}
        </div>
      </div>
    </div>
  );
}



