'use client';

import { FormularioAdopcionData } from "@/types/formularioadopcion";

interface Props {
  formData: FormularioAdopcionData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DeclaracionFinal({ formData, onChange }: Props) {
  return (
    <div className="max-w-xl mx-auto bg-white border border-pink-300 rounded-xl p-8 shadow-md">
      <fieldset className="space-y-6">
        <legend className="text-2xl font-semibold text-center text-pink-600 mb-4">
          Declaración Final
        </legend>

        <p className="text-base text-gray-900">
          Declaro que toda la información proporcionada es verdadera. Entiendo que este formulario no garantiza la adopción,
          y que la entidad protectora puede hacer una visita pre o post adopción.
        </p>

        <div className="flex items-center space-x-8 text-base text-gray-900">
          {['Sí', 'No'].map((opcion) => (
            <label key={opcion} className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="declaracionFinal"
                value={opcion}
                checked={formData.declaracionFinal === opcion}
                onChange={onChange}
                required
                className="mr-2"
              />
              {opcion}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
