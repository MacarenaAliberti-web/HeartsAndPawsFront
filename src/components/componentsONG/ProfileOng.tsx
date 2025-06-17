"use client";
import React from "react";
import { useOngAuth } from "@/context/OngAuthContext";

const ProfileOng = () => {
  const { ong: user } = useOngAuth();

  if (!user) {
    return <p className="text-black">Cargando datos del usuario...</p>;
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-2 text-pink-700">
        ¡Hola, {user.name}! 👋
      </h1>
      <p className="text-gray-700 mb-6">
        Bienvenida/o a tu perfil. Aquí podés ver tus datos registrados.
      </p>

      <div className="bg-white p-6 rounded shadow max-w-lg space-y-4">
        <div>
          <strong className="block text-pink-600">Nombre:</strong>
          <span>{user.name}</span>
        </div>
        <div>
          <strong className="block text-pink-600">Email:</strong>
          <span>{user.email}</span>
        </div>
        {user.address && (
          <div>
            <strong className="block text-pink-600">Dirección:</strong>
            <span>{user.address}</span>
          </div>
        )}
        {user.phone && (
          <div>
            <strong className="block text-pink-600">Teléfono:</strong>
            <span>{user.phone}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileOng;
