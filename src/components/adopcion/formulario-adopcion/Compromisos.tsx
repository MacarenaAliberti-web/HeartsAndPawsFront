'use client';

import { FormularioAdopcionData } from "@/types/formularioadopcion";

interface Props {
  formData: FormularioAdopcionData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function Compromisos({ formData, onChange }: Props) {
  const compromisos = [
    {
      name: 'gastosVeterinarios',
      label:
        '¿Estás dispuesto a cubrir los gastos veterinarios (vacunas, esterilización, emergencias)?',
    },
    {
      name: 'alimentacion',
      label: '¿Proporcionar alimento adecuado y atención diaria?',
    },
    {
      name: 'dedicacion',
      label: '¿Dar amor, tiempo y ejercicio a la mascota?',
    },
    {
      name: 'devolucionResponsable',
      label: '¿Devolver al animal si no puedes cuidarlo más, en lugar de abandonarlo?',
    },
  ] as const;

  return (
    <div className="max-w-xl mx-auto bg-white border border-pink-300 rounded-xl p-8 shadow-md">
      <h2 className="text-3xl font-semibold text-pink-600 mb-6 text-center">
        Compromisos y Responsabilidades
      </h2>

      <fieldset className="space-y-6">
        {compromisos.map(({ name, label }) => (
          <div key={name}>
            <p className="font-medium text-base text-gray-900 mb-1">{label}</p>
            <label className="inline-flex items-center mr-6 text-base text-gray-900">
              <input
                type="radio"
                name={name}
                value="Sí"
                checked={formData[name] === 'Sí'}
                onChange={onChange}
                required
                className="mr-2"
              />
              Sí
            </label>
            <label className="inline-flex items-center text-base text-gray-900">
              <input
                type="radio"
                name={name}
                value="No"
                checked={formData[name] === 'No'}
                onChange={onChange}
                required
                className="mr-2"
              />
              No
            </label>
          </div>
        ))}

        <div>
          <label htmlFor="quePasaSiNoPuedo" className="block font-medium text-base text-gray-900 mb-1">
            ¿Qué pasará con la mascota si tú ya no puedes cuidarla?
          </label>
          <textarea
            id="quePasaSiNoPuedo"
            name="quePasaSiNoPuedo"
            value={formData.quePasaSiNoPuedo}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded text-base text-gray-900"
          />
        </div>
      </fieldset>
    </div>
  );
}
