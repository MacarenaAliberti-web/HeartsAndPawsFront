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
    } else {
      return { ok: false, mensaje: response.mensaje || 'Error en el registro' };
    }
  } catch {
    return { ok: false, mensaje: 'Error de red o servidor' };
  }
};
