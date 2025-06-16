"use client"; 
import React from "react";
import { useForm } from "react-hook-form";
import { useOngAuth } from "@/context/OngAuthContext";

interface IFormData {
  name: string;
  email: string;
  address: string;
  phone: string;
  // imagenPerfil: File | null;
}

const ProfileOng = () => {
  const { ong: userData } = useOngAuth();
  const user = userData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      address: (user as any)?.address || "",  // Si address no está en tipo, usa as any
      phone: (user as any)?.phone || "",
    },
  });

  React.useEffect(() => {
    reset({
      // imagenPerfil: user?.imagenPerfil || "",
      name: user?.name || "",
      email: user?.email || "",
      address: (user as any)?.address || "",
      phone: (user as any)?.phone || "",
    });
  }, [user, reset]);

  const onSubmit = (data: IFormData) => {
    if (!userData) return;

    // Aquí actualizarías en el backend la info, por ahora solo lo logueamos
    console.log("Datos actualizados:", data);

    // Si quisieras actualizar el contexto, tendrías que agregar setOng o similar en OngAuthContext
  };

  if (!user) {
    return <p className="text-black">Cargando datos del usuario...</p>;
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
        {/* Nombre */}
        <div>
          <label className="block font-semibold mb-1">Nombre:</label>
          <input
            type="text"
            {...register("name", { required: "El nombre es obligatorio" })}
            className="w-full p-2 border rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email:</label>
          <input
            type="email"
            {...register("email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Formato de email inválido",
              },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label className="block font-semibold mb-1">Dirección:</label>
          <input
            type="text"
            {...register("address", { required: "La dirección es obligatoria" })}
            className="w-full p-2 border rounded"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block font-semibold mb-1">Teléfono:</label>
          <input
            type="tel"
            {...register("phone", {
              required: "El teléfono es obligatorio",
              minLength: {
                value: 6,
                message: "El teléfono debe tener al menos 6 dígitos",
              },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
        >
          Guardar cambios
        </button>
      </form>
    </section>
  );
};

export default ProfileOng;

