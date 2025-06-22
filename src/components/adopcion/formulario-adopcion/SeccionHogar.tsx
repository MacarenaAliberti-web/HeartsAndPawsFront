'use client';

import { FormularioAdopcionData } from "@/types/formularioadopcion";

interface Props {
  formData: FormularioAdopcionData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function SeccionHogar({ formData, onChange }: Props) {
  const opcionesTipoVivienda = ['Casa con patio', 'Departamento', 'Casa sin patio'];

  const esOpcionPredefinida = opcionesTipoVivienda.includes(formData.tipoVivienda);

  return (
    <div className="max-w-xl mx-auto bg-white border border-pink-300 rounded-xl p-8 shadow-md">
      <h2 className="text-3xl font-semibold text-pink-600 mb-6 text-center">
        Sobre tu Hogar
      </h2>

      <fieldset className="space-y-6">
        {/* Tipo de vivienda */}
        <div>
          <label className="block font-medium text-sm mb-1">¿Tipo de vivienda?</label>
          {opcionesTipoVivienda.map((tipo) => (
            <label key={tipo} className="block text-sm">
              <input
                type="radio"
                name="tipoVivienda"
                value={tipo}
                checked={formData.tipoVivienda === tipo}
                onChange={onChange}
                required
              />{' '}
              {tipo}
            </label>
          ))}
          <input
            type="text"
            name="tipoVivienda"
            placeholder="Otro"
            value={esOpcionPredefinida ? '' : formData.tipoVivienda}
            onChange={onChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Con quién vives */}
        <div>
          <label className="block font-medium text-sm mb-1">¿Con quién vives?</label>
          {['Solo/a', 'Pareja'].map((op) => (
            <label key={op} className="block text-sm">
              <input
                type="radio"
                name="conQuienVives"
                value={op}
                checked={formData.conQuienVives === op}
                onChange={onChange}
                required
              />{' '}
              {op}
            </label>
          ))}
          <input
            type="text"
            name="hijosEdades"
            placeholder="Hijos (edades...)"
            value={formData.hijosEdades}
            onChange={onChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="otrosConviven"
            placeholder="Otros: ..."
            value={formData.otrosConviven}
            onChange={onChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Tiene otras mascotas */}
        <div>
          <label className="block font-medium text-sm mb-1">¿Hay otras mascotas en casa?</label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="tieneMascotas"
              value="Sí"
              checked={formData.tieneMascotas === 'Sí'}
              onChange={onChange}
              required
            />{' '}
            Sí
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="tieneMascotas"
              value="No"
              checked={formData.tieneMascotas === 'No'}
              onChange={onChange}
              required
            />{' '}
            No
          </label>
          <textarea
            name="otrasMascotas"
            placeholder="Especificar especie, raza, edad y si están esterilizados"
            value={formData.otrasMascotas}
            onChange={onChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </fieldset>
    </div>
  );
}
