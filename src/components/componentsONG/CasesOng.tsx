"use client";

import { useState, useEffect } from "react";
import CasoCard from "./CasoCard";
import CasoModal from "./CasoModal";
import { Caso } from "@/types/casos";
import { useOngAuth } from "@/context/OngAuthContext";
import { getCasesByOng } from "@/services/casesService";

export default function CasesOng() {
  const { ong } = useOngAuth();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null);

  useEffect(() => {
    if (!ong) return;

    const fetchCasos = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getCasesByOng();
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

  const handleConocerHistoria = (id: string) => {
    const caso = casos.find((c) => c.id === id);
    if (caso) {
      setCasoSeleccionado(caso);
    }
  };

  const cerrarModal = () => setCasoSeleccionado(null);

  return (
    <div className="flex flex-col items-center justify-start py-10 px-4 bg-pink-50 min-h-screen">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 mb-2">
          Mis casos publicados
        </h1>
        <p className="text-gray-600 text-lg mb-6 text-center">
          Acá podés ver todos los casos que registraste como ONG.
        </p>

        {loading && <p className="text-center text-gray-500">Cargando casos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && casos.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No tenés casos publicados aún.
          </p>
        )}

        <div className="flex flex-wrap gap-8 justify-center">
          {casos.map((caso) => (
            <div key={caso.id} className="flex flex-col items-center w-full max-w-xs">
              <CasoCard caso={caso} onConocerHistoria={handleConocerHistoria} />
            </div>
          ))}
        </div>
      </div>

      {casoSeleccionado && (
        <CasoModal
          caso={casoSeleccionado}
          visible={true}
          onClose={cerrarModal}
        />
      )}
    </div>
  );
}
