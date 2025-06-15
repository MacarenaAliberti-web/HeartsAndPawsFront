"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";

interface ISolicitud {
  id: number;
  caseId: number;
  userId: number;
  message: string;
  date: string;
  status: "pendiente" | "aceptada" | "rechazada";
  caseTitle: string; // opcional, para mostrar
  userName: string; // opcional, para mostrar
}

const AdoptionsOng = () => {
  const { userData } = useAppContext();
  const [solicitudes, setSolicitudes] = useState<ISolicitud[]>([]);

  useEffect(() => {
    if (userData?.user?.id) {
      fetch(`/api/solicitudes?ongId=${userData.user.id}`)
        .then((res) => res.json())
        .then((data) => setSolicitudes(data))
        .catch((err) => console.error("Error al cargar solicitudes:", err));
    }
  }, [userData]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Solicitudes de Adopción Recibidas</h1>
      {solicitudes.length === 0 ? (
        <p>No hay solicitudes aún.</p>
      ) : (
        <ul className="space-y-4">
          {solicitudes.map((sol) => (
            <li
              key={sol.id}
              className="bg-white p-4 rounded shadow border"
            >
              <p><strong>Usuario:</strong> {sol.userName}</p>
              <p><strong>Caso:</strong> {sol.caseTitle}</p>
              <p><strong>Mensaje:</strong> {sol.message}</p>
              <p><strong>Fecha:</strong> {new Date(sol.date).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> {sol.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdoptionsOng
