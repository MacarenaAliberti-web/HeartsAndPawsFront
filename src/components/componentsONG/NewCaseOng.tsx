"use client";
import React from "react";
import { useForm } from "react-hook-form";

interface ICasoFormData {
  title: string;
  description: string;
  type: string;
  image: string;
  location: string;
};

const NewCaseOng = () => {
 const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICasoFormData>()
  
  const onSubmit = (data:ICasoFormData) => {
    console.log("Datos enviados:", data);
    // Aquí podés hacer un POST al backend si querés
  };

  return (
    <div className="text-black">
      <h1 className="text-3xl font-bold mb-6">Publicar Nuevo Caso</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <div>
          <label className="block mb-1 font-semibold">Título del caso</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full p-2 border rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Descripción</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full p-2 border rounded"
          />
          {errors.description && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Tipo</label>
          <select
            {...register("type", { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecciona uno</option>
            <option value="adopcion">Adopción</option>
            <option value="donacion">Donación</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Imagen (URL)</label>
          <input
            type="text"
            {...register("image", { required: true })}
            className="w-full p-2 border rounded"
          />
          {errors.image && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Ubicación</label>
          <input
            type="text"
            {...register("location", { required: true })}
            className="w-full p-2 border rounded"
          />
          {errors.location && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
        </div>

        <button
          type="submit"
          className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
        >
          Publicar caso
        </button>
      </form>
    </div>
  );
};

export default NewCaseOng
