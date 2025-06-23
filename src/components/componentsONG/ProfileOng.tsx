"use client";
import React from "react";
import { useOngAuth } from "@/context/OngAuthContext";

const ProfileOng = () => {
  const { ong } = useOngAuth();

  if (!ong) {
    return (
      <div className="text-center text-gray-500">
        No hay datos de la ONG cargados.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-pink-600 text-center">Perfil de la ONG</h2>

      <div className="space-y-4 text-lg">
        <p><span className="font-semibold">Nombre:</span> {ong.nombre}</p>
        <p><span className="font-semibold">Descripción:</span> {ong.descripcion}</p>
        <p><span className="font-semibold">Teléfono:</span> {ong.telefono}</p>
        <p><span className="font-semibold">Dirección:</span> {ong.direccion}</p>
        <p><span className="font-semibold">Ciudad:</span> {ong.ciudad}</p>
        <p><span className="font-semibold">País:</span> {ong.pais}</p>
      </div>

      {ong.imagenPerfil && (
        <div className="mt-6 text-center">
          <img
            src={ong.imagenPerfil}
            alt={`Foto de perfil de ${ong.nombre}`}
            className="w-48 h-48 object-cover rounded-full mx-auto border-4 border-pink-500 shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default ProfileOng;