"use client";

import { Caso } from "@/types/casos";
import Image from "next/image";

type CasoModalProps = {
  caso: Caso;
  visible: boolean;
  onClose: () => void;
};

export default function CasoModal({ caso, visible, onClose }: CasoModalProps) {
  if (!visible) return null;

  const imagenUrl =
    caso.mascota.imagenes?.[0]?.url ?? "https://via.placeholder.com/400x300?text=Mascota";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-pink-100 bg-opacity-30"
      onClick={onClose}
    >
      <div
        className="relative bg-pink-50 rounded-2xl shadow-lg max-w-md w-full p-6 border border-pink-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-pink-500 hover:text-pink-700 text-3xl font-bold z-10"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <div className="mb-4 flex justify-center">
          <Image
            src={imagenUrl}
            alt={caso.mascota.nombre}
            width={400}
            height={300}
            className="rounded-md object-cover"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-pink-600 mb-4 text-center">
          {caso.titulo}
        </h2>

        <div className="max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed text-gray-700 text-center">
          {caso.descripcion}
        </div>
      </div>
    </div>
  );
}
