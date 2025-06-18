// src/services/login.ts

export const loginUserService = async (email: string, contrasena: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/usuarios/ingreso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, contrasena }),
    });

    const data = await res.json();

    if (res.ok && data.ok) {
      return { ok: true, usuario: data.usuario };
    } else {
      return { ok: false, mensaje: data.mensaje || 'Error en login' };
    }
  } catch {
    return { ok: false, mensaje: 'Error de red o servidor' };
  }
};
