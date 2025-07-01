"use client";
import React from "react";
import SelectPet from "./SelectPet";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { FormInputs } from "@/types/formsOng";


interface Props {
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  watch: UseFormWatch<FormInputs>;
}


const CaseForm = ({ register, errors, watch }: Props) => {
  const type = watch("type");

  return (
    <>
      <div>
        <label className="block mb-2 font-semibold">Título</label>
        <input
          type="text"
          {...register("title", { required: true })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">
            Este campo es obligatorio.
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-semibold">Descripción</label>
        <textarea
          {...register("description", { required: true })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
          rows={4}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            Este campo es obligatorio.
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-semibold">Tipo de caso</label>
        <select
          {...register("type", { required: true })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">Selecciona uno</option>
          <option value="ADOPCION">Adopción</option>
          <option value="DONACION">Donación</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-sm mt-1">
            Este campo es obligatorio.
          </p>
        )}
      </div>

      <SelectPet register={register} errors={errors} />

      {/* Eliminado el campo metaDonación porque se hardcodea desde el componente padre */}

      {type === "DONACION" && (
        <div>
          <label className="block mb-2 font-semibold">
            Meta de donación
          </label>
          <input
            type="number"
            {...register("donationGoal", { required: true, min: 1 })}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Ej: 50000"
          />
          {errors.donationGoal && (
            <p className="text-red-500 text-sm mt-1">
              Este campo es obligatorio y debe ser mayor a 0.
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default CaseForm;