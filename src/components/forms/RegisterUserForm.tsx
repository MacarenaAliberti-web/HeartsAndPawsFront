'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import FormBase from '@/components/forms/FormBase';
import { useUsuarioAuth } from '@/context/UsuarioAuthContext';
import { RegisterData } from '@/types/user';


export default function RegisterUserForm() {
  const { registerUser } = useUsuarioAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterData>({
    nombre: '',
    email: '',
    contrasena: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const campos: { name: keyof RegisterData; label: string; type?: string }[] = [
    { name: 'nombre', label: 'Nombre' },
    { name: 'email', label: 'Correo electrónico', type: 'email' },
    { name: 'contrasena', label: 'Contraseña', type: 'password' },
    { name: 'telefono', label: 'Teléfono' },
    { name: 'direccion', label: 'Dirección' },
    { name: 'ciudad', label: 'Ciudad' },
    { name: 'pais', label: 'País' },
  ];

  const validarCampo = (name: keyof RegisterData, value: string) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) error = 'Email requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Email inválido';
        break;
      case 'contrasena':
        if (!value) error = 'Contraseña requerida';
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(value)) {
          error = 'Debe tener 8 caracteres, mayúscula, número y símbolo';
        }
        break;
      default:
        if (!value.trim()) error = `Campo ${name} requerido`;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validarCampo(name as keyof RegisterData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hayErrores = false;
    for (const [key, value] of Object.entries(formData)) {
      validarCampo(key as keyof RegisterData, value);
      if (errors[key as keyof RegisterData]) hayErrores = true;
    }

    if (hayErrores) {
      toast.error('Corregí los errores del formulario');
      return;
    }

    setIsLoading(true);
    const result = await registerUser(formData);
    setIsLoading(false);

    if (result.ok) {
      toast.success(result.mensaje);
      router.push('/login/login-user');
    } else {
      toast.error(result.mensaje);
    }
  };

  return (
    <div className="py-10">
      <Toaster position="top-center" />
      <FormBase
        title="Registro de Usuario"
        fields={campos}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        showPasswordToggle={true}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    </div>
  );
}
