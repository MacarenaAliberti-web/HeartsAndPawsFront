"use client";
import { useEffect, useState } from "react";
import { useOngAuth } from "@/context/OngAuthContext";

interface ISolicitud {
  id: number;
  caseId: number;
  userId: number;
  message: string;
  date: string;
  status: "pendiente" | "aceptada" | "rechazada";
  caseTitle: string;
  userName: string;
}

const AdoptionsOng = () => {
  const { ong } = useOngAuth();
  const [solicitudes, ] = useState<ISolicitud[]>([]);

  useEffect(() => {
    /*
    if (ong?.id) {
      fetch(`/api/solicitudes?ongId=${ong.id}`)
        .then(res => res.json())
        .then(data => setSolicitudes(data))
        .catch(err => console.error("Error al cargar solicitudes:", err));
    }*/
  }, [ong]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Solicitudes de Adopción Recibidas</h1>
      {solicitudes.length === 0 ? (
        <p>No hay solicitudes aún.</p>
      ) : (
        <ul className="space-y-4">
          {solicitudes.map(sol => (
            <li key={sol.id} className="p-4 bg-white border rounded shadow">
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

export default AdoptionsOng;
