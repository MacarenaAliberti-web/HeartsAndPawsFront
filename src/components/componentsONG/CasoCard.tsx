"use client";

import { useState } from "react";
import Image from "next/image";
import { Caso } from "@/types/casos";

type Props = {
  caso: Caso;
  onConocerHistoria?: (id: string) => void;
};

export default function CasoCard({ caso, onConocerHistoria }: Props) {
  const imagenes = caso.mascota.imagenes ?? [];
  const [imagenActual, setImagenActual] = useState(0);
  const totalImagenes = imagenes.length;

  const irAAnterior = () => {
    setImagenActual((prev) => (prev === 0 ? totalImagenes - 1 : prev - 1));
  };

  const irASiguiente = () => {
    setImagenActual((prev) => (prev === totalImagenes - 1 ? 0 : prev + 1));
  };

  const imagenUrl =
    imagenes[imagenActual]?.url ?? "https://via.placeholder.com/400x300?text=Mascota";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col w-full max-w-xs">
      {/* 🖼 Carrusel de imágenes */}
      <div className="relative w-full h-48 p-2 flex items-center justify-center bg-white">
        <Image
          src={imagenUrl}
          alt={caso.mascota.nombre}
          width={180}
          height={130}
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {totalImagenes > 1 && (
          <>
            <button
              onClick={irAAnterior}
              className="absolute left-2 text-pink-600 text-xl bg-white rounded-full shadow p-1 hover:bg-pink-100 transition z-10"
              type="button"
            >
              ◀
            </button>
            <button
              onClick={irASiguiente}
              className="absolute right-2 text-pink-600 text-xl bg-white rounded-full shadow p-1 hover:bg-pink-100 transition z-10"
              type="button"
            >
              ▶
            </button>
          </>
        )}
      </div>

      <div className="p-7 flex-1 flex flex-col justify-between">
        <h2 className="text-xl font-bold text-pink-600 mb-2">{caso.mascota.nombre}</h2>

        <div className="mt-auto">
          <button
            onClick={() => onConocerHistoria?.(caso.id)}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-full transition"
          >
            Más info
          </button>
        </div>
      </div>
    </div>
  );
}




// // components/casos/CasoCard.tsx
// "use client";

// import { Caso } from "@/types/casos";
// import Image from "next/image";

// type Props = {
//   caso: Caso;
//   onConocerHistoria?: (id: string) => void;
// };

// export default function CasoCard({ caso, onConocerHistoria }: Props) {
//   const imagenUrl =
//     caso.mascota.imagenes?.[0]?.url ?? "https://via.placeholder.com/400x300?text=Mascota";

//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col w-full max-w-xs">
//       <div className="w-full h-48 p-2 flex items-center justify-center bg-white">
//         <Image
//           src={imagenUrl}
//           alt={caso.mascota.nombre}
//           width={180}
//           height={130}
//           className="object-contain"
//           sizes="(max-width: 768px) 100vw, 33vw"
//         />
//       </div>

//       <div className="p-7 flex-1 flex flex-col justify-between">
//         <h2 className="text-xl font-bold text-pink-600 mb-2">{caso.mascota.nombre}</h2>

//         <div className="mt-auto">
//           <button
//             onClick={() => onConocerHistoria?.(caso.id)}
//             className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-full transition"
//           >
//             Más info
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
