"use client";
import React from "react";
import { useOngAuth } from "@/context/OngAuthContext";

 export const ProfileOng = () => {
  const { ong: user } = useOngAuth();

  if (!user) {
    return <p className="text-black">Cargando datos del usuario...</p>;
  }

  return (
    <section>
      <h1 className="mb-2 text-3xl font-bold text-pink-700">
        ¡Hola, {user.name}! 👋
      </h1>
      <p className="mb-6 text-gray-700">
        Bienvenida/o a tu perfil. Aquí podés ver tus datos registrados.
      </p>

      <div className="max-w-lg p-6 space-y-4 bg-white rounded shadow">
        <div>
          <strong className="block text-pink-600">Nombre:</strong>
          <span>{user.name}</span>
        </div>
        <div>
          <strong className="block text-pink-600">Email:</strong>
          <span>{user.email}</span>
        </div>
        {user.direccion && (
          <div>
            <strong className="block text-pink-600">Dirección:</strong>
            <span>{user.direccion}</span>
          </div>
        )}
        {user.telefono && (
          <div>
            <strong className="block text-pink-600">Teléfono:</strong>
            <span>{user.telefono}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileOng;
