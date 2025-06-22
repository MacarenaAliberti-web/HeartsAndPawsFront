'use client';

import { FormularioAdopcionData } from '@/types/formularioadopcion';

interface Props {
  formData: FormularioAdopcionData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DatosPersonales({ formData, onChange }: Props) {
  const campos: { name: keyof FormularioAdopcionData; label: string; type?: string }[] = [
    { name: 'nombre', label: 'Nombre completo' },
    { name: 'edad', label: 'Edad' },
    { name: 'dni', label: 'DNI o identificación' },
    { name: 'direccion', label: 'Dirección completa' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'email', label: 'Correo electrónico', type: 'email' },
    { name: 'ocupacion', label: 'Ocupación' },
    { name: 'estadoCivil', label: 'Estado civil' },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white border border-pink-300 rounded-xl p-8 shadow-md">
      <fieldset className="space-y-4">
        <legend className="text-2xl font-bold text-center text-pink-600 mb-6">Datos Personales</legend>

        {campos.map(({ name, label, type }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type={type || 'text'}
              id={name}
              name={name}
              value={formData[name] ?? ''}
              onChange={onChange}
              className="w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:border-pink-500 focus:ring-pink-200"
              required
            />
          </div>
        ))}
      </fieldset>
    </div>
  );
}
