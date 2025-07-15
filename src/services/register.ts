// src/services/register.ts
import { RegisterData } from '@/types/user';

export const registerUserService = async (data: RegisterData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (res.ok && response.ok) {
      return { ok: true, mensaje: response.mensaje };
    } else if (res.status === 409) {
      return { ok: false, mensaje: response.mensaje || 'El correo ya está registrado' };
    } else {
      return { ok: false, mensaje: response.mensaje || 'Error en el registro' };
    }
  } catch {
    return { ok: false, mensaje: 'Error de red o servidor' };
  }
};

export const verificarEmailUsuario = async (email: string): Promise<{ existe: boolean }> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/verificar-email/${email}`);

  if (!res.ok) {
    throw new Error("Error al verificar el email");
  }

  return res.json(); 
};

export const verificarEmailOng = async (email: string): Promise<{ existe: boolean }> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizaciones/verificar-email/${email}`);
  if (!res.ok) throw new Error('Error al verificar email ONG');
  return res.json(); 
};
