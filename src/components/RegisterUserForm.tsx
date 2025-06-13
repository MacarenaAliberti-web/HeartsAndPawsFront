'use client';

import { useState } from 'react';

interface FormDataType {
  nombre: string;
  email: string;
  contraseña: string;
  telefono: string;
  direccion: string;
}

export default function RegisterUserForm() {
  const [formData, setFormData] = useState<FormDataType>({
    nombre: '',
    email: '',
    contraseña: '',
    telefono: '',
    direccion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/registro-usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert('Usuario registrado con éxito');
      // Puedes limpiar el form si quieres
      setFormData({
        nombre: '',
        email: '',
        contraseña: '',
        telefono: '',
        direccion: '',
      });
    } else {
      alert('Error al registrar el usuario');
    }
  };

  const campos: { name: keyof FormDataType; label: string; type?: string }[] = [
    { name: 'nombre', label: 'Nombre' },
    { name: 'email', label: 'Correo electrónico', type: 'email' },
    { name: 'contraseña', label: 'Contraseña', type: 'password' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'direccion', label: 'Dirección' },
  ];

  return (
    <div className="py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-2xl mx-auto p-8 rounded-xl shadow-lg border border-pink-600 space-y-6"
      >
        <h2 className="text-3xl font-bold text-pink-600 text-center">
          Registro de Usuario
        </h2>

        {campos.map(({ name, label, type = 'text' }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {label}
            </label>
            <input
              type={type}
              name={name}
              id={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-md transition"
        >
          Registrar Usuario
        </button>
      </form>
    </div>
  );
}
