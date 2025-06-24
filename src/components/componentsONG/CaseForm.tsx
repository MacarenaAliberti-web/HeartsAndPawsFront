"use client";
import React from "react";
import SelectPet from "../componentsong/SelectPet";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";


interface FormData {
  title: string;
  description: string;
  type: string;
}

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
}

const CaseForm = ({ register, errors, watch }: Props) => {
  const type = watch("type");
console.log(type);
  return (
    <>
      <div>
        <label className="block mb-2 font-semibold">Título</label>
        <input
          type="text"
          {...register("title", { required: true })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>}
      </div>

      <div>
        <label className="block mb-2 font-semibold">Descripción</label>
        <textarea
          {...register("description", { required: true })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
          rows={4}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>}
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
        {errors.type && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>}
      </div>

      <SelectPet register={register} errors={errors} />

      {/* Eliminado el campo metaDonación porque se hardcodea desde el componente padre */}
    </>
  );
};

export default CaseForm;