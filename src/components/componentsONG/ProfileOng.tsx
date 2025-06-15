"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "@/context/AppContext";

interface IFormData {
  name: string;
  email: string;
  address: string;
  phone: string;
  // imagenPerfil: File | null;
}

const ProfileOng = () => {
   const { userData, setUserData } = useAppContext();
  const user = userData?.user;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
      phone: user?.phone || "",
    },
  });

  // Cada vez que cambie user, reiniciamos el formulario para tener datos actualizados
  React.useEffect(() => {
    reset({
    //   imagenPerfil: user?.imagenPerfil || "",
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
      phone: user?.phone || "",
    });
  }, [user, reset]);

  const onSubmit = (data: IFormData) => {
    if (!userData) return;

    // Aquí actualizarías en el backend la info, por ahora simulamos
    console.log("Datos actualizados:", data);

    // Actualizamos el contexto con los nuevos datos (simulación)
    setUserData({
      ...userData,
      user: {
        ...userData.user,
        name: data.name,
        email: data.email,
        address: data.address,
        phone: data.phone,
      },
    });
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


export default ProfileOng
