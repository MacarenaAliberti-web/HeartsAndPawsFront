
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useOngAuth } from "@/context/OngAuthContext";
import toast from "react-hot-toast";
import CaseForm from "./CaseForm";
import NewPet from "./NewPet";
import { createCase } from "@/services/createCases";


interface FormData {
  title: string;
  description: string;
  type: "ADOPCION" | "DONACION";
  petId: string;
  donationGoal?: number;
}

const NewCaseOng = () => {
  const { ong } = useOngAuth();
  const [mostrarNewPet, setMostrarNewPet] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>();

  if (mostrarNewPet) return <NewPet />; // ⬅️ Redirige directo al componente

  const onSubmit = async (data: FormData) => {
    if (!ong) return toast.error("Falta el ID de la ONG");

    const body =
      data.type === "DONACION"
        ? {
            titulo: data.title,
            descripcion: data.description,
            tipo: "DONACION",
            mascotaId: data.petId,
            ongId: ong.id,
            donacion: {
              metaDonacion: 100000,
            },
          }
        : {
            titulo: data.title,
            descripcion: data.description,
            tipo: "ADOPCION",
            mascotaId: data.petId,
            ongId: ong.id,
          };

    try {
      await createCase(body);
      toast.success("Caso publicado con éxito");
      reset();
    } catch (err) {
      toast.error("Falló la publicación del caso");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-center text-pink-600">Crear nuevo caso</h1>

      {/* Botón para redirigir al form de mascota */}
      {/* <div className="flex justify-center mb-6">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-lg transition"
          onClick={() => setMostrarNewPet(true)}
        >
          Crear nueva mascota
        </button>
      </div> */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <CaseForm register={register} errors={errors} watch={watch} />
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition duration-300"
        >
          Publicar caso
        </button>
      </form>
    </div>
  );
};

export default NewCaseOng;