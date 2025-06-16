'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

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

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validarCampos = () => {
    if (!formData.nombre.match(/^[A-Za-zÀ-ÿ\s]+$/)) {
      return 'El nombre solo puede contener letras y espacios.';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return 'El correo electrónico no es válido.';
    }

    if (
      !formData.contrasena.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/
      )
    ) {
      return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.';
    }

    if (!/^\d+$/.test(formData.telefono)) {
      return 'El teléfono debe contener solo números.';
    }

    if (!formData.direccion.match(/^[a-zA-Z0-9.,_\-\s]+$/)) {
      return 'La dirección contiene caracteres no permitidos.';
    }

    if (!formData.ciudad.match(/^[A-Za-z0-9 ]+$/)) {
      return 'La ciudad solo puede contener letras, números y espacios.';
    }

    if (!formData.pais.match(/^[a-zA-Z0-9]+$/)) {
      return 'El país solo puede contener letras y números (sin espacios).';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMsg = validarCampos();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

        setTimeout(() => {
          router.push('/login/loginUsuario');
        }, 500);
      } else {
        toast.error(data.mensaje || 'Error desconocido al registrar el usuario.');
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
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '8px',
          },
          success: {
            style: {
              background: '#ec4899',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ec4899',
            },
          },
          error: {
            style: {
              background: '#fee2e2',
              color: '#b91c1c',
            },
            iconTheme: {
              primary: '#b91c1c',
              secondary: '#fee2e2',
            },
          },
        }}
      />

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
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none disabled:opacity-50"
            />
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
