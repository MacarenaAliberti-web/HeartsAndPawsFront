"use client";

import { useEffect, useState } from "react";
import { useOngAuth } from "@/context/OngAuthContext";
import { Donacion, getDonacionesPorOng } from "@/services/donacionesOng";

export default function DonationsOng() {
  const { ong } = useOngAuth();
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ong?.id) {
      setLoading(false);
      return;
    }

    getDonacionesPorOng(ong.id)
      .then((data) => {
        const donacionesOrdenadas = data
          .slice()
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

        setDonaciones(donacionesOrdenadas);
        setError(null);
      })
      .catch((e) => {
        console.error(e);
        setError("No se pudieron cargar las donaciones.");
      })
      .finally(() => setLoading(false));
  }, [ong?.id]);

  if (loading) return <p className="text-center mt-10">Cargando donaciones...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!ong) return <p className="text-center mt-10">No se encontró la organización autenticada.</p>;

  return (
    <div className="bg-pink-50 min-h-screen p-6 flex justify-center">
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">
          Historial de Donaciones
        </h1>

        {donaciones.length === 0 ? (
          <p className="text-gray-600 text-center">
            No hay donaciones registradas.
          </p>
        ) : (
          donaciones.map((donacion) => (
            <div
              key={donacion.id}
              className="bg-white border border-pink-200 rounded-2xl shadow-md p-6 space-y-2"
            >
              <p className="text-pink-700 font-semibold text-lg">
                Donante: {donacion.usuario?.nombre || "Anónimo"}
              </p>
              <p>
                <strong>Email:</strong> {donacion.usuario?.email || "No disponible"}
              </p>
              <p>
                <strong>Monto:</strong> ${donacion.monto}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date(donacion.fecha).toLocaleString()}
              </p>
              <p>
                <strong>Estado del Pago:</strong>{" "}
                {(() => {
                  const estado = donacion.estadoPago.toLowerCase();

                  const estadoPagoTraducido: Record<string, string> = {
                    paid: "Pagado",
                    pending: "Pendiente",
                    failed: "Fallido",
                    canceled: "Cancelado",
                  };

                  const colorEstadoPago: Record<string, string> = {
                    paid: "text-green-600",
                    pending: "text-yellow-600",
                    failed: "text-red-600",
                    canceled: "text-gray-600",
                  };

                  const iconoEstado: Record<string, string> = {
                    paid: "✅",
                    pending: "⏳",
                    failed: "❌",
                    canceled: "🚫",
                  };

                  return (
                    <span
                      className={`font-semibold capitalize ${
                        colorEstadoPago[estado] || "text-gray-700"
                      }`}
                    >
                      {iconoEstado[estado] || "❔"}{" "}
                      {estadoPagoTraducido[estado] || donacion.estadoPago}
                    </span>
                  );
                })()}
              </p>
              {donacion.mascota && (
                <p>
                  <strong>Mascota beneficiada:</strong> {donacion.mascota.nombre}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}





// "use client";

// import { useEffect, useState } from "react";
// import { useOngAuth } from "@/context/OngAuthContext";
// import { Donacion, getDonacionesPorOng } from "@/services/donacionesOng";

// export default function DonationsOng() {
//   const { ong } = useOngAuth();
//   const [donaciones, setDonaciones] = useState<Donacion[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!ong?.id) {
//       setLoading(false);
//       return;
//     }

//     getDonacionesPorOng(ong.id)
//       .then((data) => {
//         console.log("Donaciones recibidas:", data);
//         setDonaciones(data);
//         setError(null);
//       })
//       .catch((e) => {
//         console.error(e);
//         setError("No se pudieron cargar las donaciones.");
//       })
//       .finally(() => setLoading(false));
//   }, [ong?.id]);

//   if (loading) return <p className="text-center mt-10">Cargando donaciones...</p>;
//   if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

//   if (!ong) return <p className="text-center mt-10">No se encontró la organización autenticada.</p>;

//   return (
//     <div className="bg-pink-50 min-h-screen p-6 flex justify-center">
//       <div className="max-w-3xl w-full space-y-6">
//         <h1 className="text-2xl font-bold text-pink-600 mb-4">Historial de Donaciones</h1>

//         {donaciones.length === 0 ? (
//           <p className="text-gray-600 text-center">No hay donaciones registradas.</p>
//         ) : (
//           donaciones.map((donacion) => (
//             <div
//               key={donacion.id}
//               className="bg-white border border-pink-200 rounded-2xl shadow-md p-6 space-y-2"
//             >
//               <p className="text-pink-700 font-semibold text-lg">
//                 Donante: {donacion.usuario?.nombre || "Anónimo"}
//               </p>
//               <p>
//                 <strong>Email:</strong> {donacion.usuario?.email || "No disponible"}
//               </p>
//               <p>
//                 <strong>Monto:</strong> ${donacion.monto}
//               </p>
//               <p>
//                 <strong>Fecha:</strong> {new Date(donacion.fecha).toLocaleString()}
//               </p>
//               <p>
//                 <strong>Estado del Pago:</strong>{" "}
//                 <span className="font-semibold capitalize text-green-600">{donacion.estadoPago}</span>
//               </p>
//               {donacion.mascota && (
//                 <p>
//                   <strong>Mascota beneficiada:</strong> {donacion.mascota.nombre}
//                 </p>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
