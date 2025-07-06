"use client";

import { useState } from "react";
import { Caso } from "@/types/casos";
import CasoCard from "./CasoCard";
import { getCasoPorId } from "@/services/casesService";
import CasoModal from "./CasoModal";

type Props = {
  casos: Caso[];
};

export default function CasosGrid({ casos }: Props) {
  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null);

  const handleConocerHistoria = async (id: string) => {
    try {
      const detalle = await getCasoPorId(id);
      setCasoSeleccionado(detalle);
    } catch (error) {
      console.error("Error al obtener detalle del caso", error);
    }
  };

  const cerrarModal = () => setCasoSeleccionado(null);

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        {casos.map((caso) => (
          <CasoCard
            key={caso.id}
            caso={caso}
            onConocerHistoria={handleConocerHistoria}
          />
        ))}
      </div>

      {casoSeleccionado && (
        <CasoModal
          caso={casoSeleccionado}
          visible={true}
          onClose={cerrarModal}
        />
      )}
    </>
  );
}
