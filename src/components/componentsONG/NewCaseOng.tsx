"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useOngAuth } from "@/context/OngAuthContext";
import toast from "react-hot-toast";
import CaseForm from "./CaseForm";
import NewPet from "./NewPet";
import { createCase } from "@/services/createCases";
import { CasoBody, FormInputs } from "@/types/formsOng";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const NewCaseOng = () => {
  const { ong } = useOngAuth();
  const router = useRouter();
  const [mostrarNewPet] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormInputs>();

  useEffect(() => {
    if (loading) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [loading]);

  if (mostrarNewPet) return <NewPet />;

  const onSubmit = async (data: FormInputs) => {
    if (!ong) {
      toast.error("Falta el ID de la ONG");
      return;
    }

    const donationGoalNum = data.donationGoal ? Number(data.donationGoal) : undefined;

    if (!data.petId) {
      toast.error("Falta seleccionar una mascota");
      return;
    }

    const body: CasoBody =
      data.type === "DONACION"
        ? {
            titulo: data.title,
            descripcion: data.description,
            tipo: "DONACION",
            mascotaId: data.petId,
            donacion: {
              metaDonacion: donationGoalNum,
            },
          }
        : {
            titulo: data.title,
            descripcion: data.description,
            tipo: "ADOPCION",
            mascotaId: data.petId,
          };

    try {
      setLoading(true);
      await createCase(body);
      toast.success("Caso publicado con éxito");
      reset();
      router.push("/dashboard/ong");
    } catch (err) {
      toast.error("Falló la publicación del caso");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen pt-20 flex justify-center bg-pink-50">
        <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg text-gray-800">
          <h1 className="text-3xl font-bold mb-4 text-center text-pink-600">
            Crear nuevo caso
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CaseForm register={register} errors={errors} watch={watch} />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition duration-300 ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              Publicar caso
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto">
          <LoaderCircle className="animate-spin w-10 h-10 text-pink-600 mb-4" />
          <p className="text-pink-600 font-semibold text-lg text-center px-4">
            Redirigiendo al formulario de caso, por favor aguarde...
          </p>
        </div>
      )}
    </>
  );
};

export default NewCaseOng;
