'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface FormDataType {
  nombre: string;
  email: string;
  contrasena: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
}

export default function RegisterUserForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataType>({
    nombre: '',
    email: '',
    contrasena: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
  });

  const [errors, setErrors] = useState<Partial<FormDataType>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validarCampo(name as keyof FormDataType, value);
  };

  const validarCampo = (name: keyof FormDataType, value: string) => {
    let error = '';

    switch (name) {
      case 'nombre':
        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(value)) {
          error = 'Solo letras y espacios.';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Correo inválido.';
        }
        break;
      case 'contrasena':
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(value)
        ) {
          error =
            'Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y símbolo.';
        }
        break;
      case 'telefono':
        if (!/^\d+$/.test(value)) {
          error = 'Solo números.';
        }
        break;
      case 'direccion':
        if (!/^[a-zA-Z0-9.,_\-\s]+$/.test(value)) {
          error = 'Caracteres no permitidos.';
        }
        break;
      case 'ciudad':
        if (!/^[A-Za-z0-9 ]+$/.test(value)) {
          error = 'Solo letras y números.';
        }
        break;
      case 'pais':
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          error = 'Sin espacios.';
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const camposInvalidos = Object.entries(formData).some(([key, val]) => {
      validarCampo(key as keyof FormDataType, val);
      return errors[key as keyof FormDataType];
    });

    if (camposInvalidos) {
      toast.error('Corregí los errores del formulario.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        toast.success(data.mensaje);
        setFormData({
          nombre: '',
          email: '',
          contrasena: '',
          telefono: '',
          direccion: '',
          ciudad: '',
          pais: '',
        });
        router.push('/login/loginUsuario');
      } else {
        toast.error(data.mensaje || 'Error desconocido.');
      }
    } catch {
      toast.error('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const campos: { name: keyof FormDataType; label: string; type?: string }[] = [
    { name: 'nombre', label: 'Nombre' },
    { name: 'email', label: 'Correo electrónico', type: 'email' },
    { name: 'contrasena', label: 'Contraseña', type: 'password' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'direccion', label: 'Dirección' },
    { name: 'ciudad', label: 'Ciudad' },
    { name: 'pais', label: 'País' },
  ];

  return (
    <div className="py-10">
      <Toaster position="top-center" />

      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-2xl mx-auto p-8 rounded-xl shadow-lg border border-pink-600 space-y-6"
      >
        <h2 className="text-3xl font-bold text-pink-600 text-center">
          Registro de Usuario
        </h2>

        {campos.map(({ name, label, type = 'text' }) => (
          <div key={name} className="relative">
            <label htmlFor={name} className="block text-sm font-medium text-gray-800 mb-1">
              {label}
            </label>
            <div className="relative">
              <input
                type={name === 'contrasena' ? (showPassword ? 'text' : 'password') : type}
                name={name}
                id={name}
                value={formData[name]}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full border ${
                  errors[name] ? 'border-red-500' : 'border-gray-300'
                } rounded-md px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none`}
              />
              {name === 'contrasena' && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2 text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>
            {errors[name] && (
              <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-md transition disabled:opacity-50"
        >
          {isLoading ? 'Registrando...' : 'Registrar Usuario'}
        </button>
      </form>
    </div>
  );
}
