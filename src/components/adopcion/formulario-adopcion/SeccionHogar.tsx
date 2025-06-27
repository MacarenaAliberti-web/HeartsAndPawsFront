'use client';

import { FormularioAdopcionData } from '@/types/formularioadopcion';

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
            disabled={esOpcionPredefinida}
            className={`mt-1 w-full p-2 border rounded ${
              esOpcionPredefinida ? 'border-gray-200 bg-gray-100 cursor-not-allowed' : 'border-gray-300'
            }`}
          />
        </div>

        {/* Integrantes de la familia */}
        <div>
          <label className="block font-medium text-sm mb-1">¿Cuántos integrantes hay en tu familia?</label>
          <input
            type="number"
            name="integrantesFlia"
            min={1}
            value={formData.integrantesFlia}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Hijos */}
        <div>
          <label className="block font-medium text-sm mb-1">¿Cuántos hijos tienen?</label>
          <input
            type="number"
            name="hijos"
            min={0}
            value={formData.hijos}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Hay otras mascotas */}
        <div>
          <label className="block font-medium text-sm mb-1">¿Hay otras mascotas en casa?</label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="hayOtrasMascotas"
              value="Sí"
              checked={formData.hayOtrasMascotas === 'Sí'}
              onChange={onChange}
              required
            />{' '}
            Sí
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hayOtrasMascotas"
              value="No"
              checked={formData.hayOtrasMascotas === 'No'}
              onChange={onChange}
              required
            />{' '}
            No
          </label>
          {formData.hayOtrasMascotas === 'Sí' && (
            <textarea
              name="descripcionOtrasMascotas"
              placeholder="Especificar especie, raza, edad y si están esterilizados"
              value={formData.descripcionOtrasMascotas || ''}
              onChange={onChange}
              className="mt-2 w-full p-2 border border-gray-300 rounded"
              required
            />
          )}
        </div>
      </fieldset>
    </div>
  );
}
