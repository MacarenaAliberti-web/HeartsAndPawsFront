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

  const [tipo, setTipo] = useState<"perro" | "gato" | "">("");
  const [orden, setOrden] = useState<"mas_reciente" | "mas_antiguo">(
    "mas_reciente"
  );

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

        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 max-w-md mx-auto mb-8">
  {/* Filtro por tipo */}
  <div className="relative w-full max-w-xs">
    <select
      value={tipo}
      onChange={(e) => setTipo(e.target.value as 'perro' | 'gato' | '')}
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

  {/* Orden */}
  <div className="relative w-full max-w-xs">
    <select
      value={orden}
      onChange={(e) => setOrden(e.target.value as 'mas_reciente' | 'mas_antiguo')}
      className="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
      aria-label="Ordenar mascotas"
    >
      <option value="mas_reciente">Más reciente</option>
      <option value="mas_antiguo">Más antiguo</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="w-5 h-5 text-pink-600"  />
    </div>
  </div>
</div>


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






// "use client";

// import { useEffect, useState } from "react";
// import { useOngAuth } from "@/context/OngAuthContext";

// type Caso = {
//   id: string;
//   titulo: string;
//   descripcion: string;
//   tipo: string;
//   mascota: {
//     nombre: string;
//     edad: number;
//     descripcion: string;
//   };
// };

// const CasesOng = () => {
//   const { ong } = useOngAuth();
//   const [casos, setCasos] = useState<Caso[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!ong) return;

//     async function fetchCasos() {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(
//           `https://backend-hearts-paws-dev.onrender.com/casos/ong/mis-casos`,
//           {
//             credentials: "include", // ✅ para enviar cookies automáticamente
//           }
//         );

//         if (!res.ok) throw new Error("Error cargando casos");
//         const data = await res.json();
//         setCasos(data);
//       } catch (e: any) {
//         setError(e.message || "Error desconocido");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCasos();
//   }, [ong]);

//   if (!ong) return <p>Debes iniciar sesión como ONG para ver tus casos.</p>;
//   if (loading) return <p>Cargando casos...</p>;
//   if (error) return <p className="text-red-600">Error: {error}</p>;
//   if (casos.length === 0) return <p>No tienes casos publicados aún.</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Mis Casos</h1>
//       <ul className="space-y-6">
//         {casos.map(({ id, titulo, descripcion, tipo, mascota }) => (
//           <li
//             key={id}
//             className="border rounded-md p-4 shadow hover:shadow-lg transition"
//           >
//             <h2 className="text-xl font-semibold">{titulo}</h2>
//             <p>
//               <strong>Tipo:</strong> {tipo}
//             </p>
//             <p>{descripcion}</p>
//             <p>
//               <strong>Mascota:</strong> {mascota.nombre} ({mascota.edad} años)
//             </p>
//             <p className="italic text-gray-600">{mascota.descripcion}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CasesOng;











// "use client";

// import { useEffect, useState } from "react";
// import { useOngAuth } from "@/context/OngAuthContext";

// type Caso = {
//   id: string;
//   titulo: string;
//   descripcion: string;
//   tipo: string;
//   mascota: {
//     nombre: string;
//     edad: number;
//     descripcion: string;
//   };
// };

// const CasesOng = () => {
//   const { ong } = useOngAuth();
//   const [casos, setCasos] = useState<Caso[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!ong) return;

//     async function fetchCasos() {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch(`https://backend-hearts-paws-dev.onrender.com/casos/ong/mis-casos`);
//         if (!res.ok) throw new Error("Error cargando casos");
//         const data = await res.json();
//         setCasos(data);
//       } catch (e: any) {
//         setError(e.message || "Error desconocido");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCasos();
//   }, [ong]);

//   if (!ong) return <p>Debes iniciar sesión como ONG para ver tus casos.</p>;
//   if (loading) return <p>Cargando casos...</p>;
//   if (error) return <p className="text-red-600">Error: {error}</p>;
//   if (casos.length === 0) return <p>No tienes casos publicados aún.</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Mis Casos</h1>
//       <ul className="space-y-6">
//         {casos.map(({ id, titulo, descripcion, tipo, mascota }) => (
//           <li key={id} className="border rounded-md p-4 shadow hover:shadow-lg transition">
//             <h2 className="text-xl font-semibold">{titulo}</h2>
//             <p><strong>Tipo:</strong> {tipo}</p>
//             <p>{descripcion}</p>
//             <p><strong>Mascota:</strong> {mascota.nombre} ({mascota.edad} años)</p>
//             <p className="italic text-gray-600">{mascota.descripcion}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CasesOng;
