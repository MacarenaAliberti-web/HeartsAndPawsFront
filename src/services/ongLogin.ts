// src/services/ongLogin.ts

export const ongLoginService = async (email: string, contrasena: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/organizaciones/ingreso`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, contrasena }),
    });

    if (!res.ok) {
      return { ok: false, mensaje: "Error en la respuesta del servidor" };
    }

    const data = await res.json();

    if (data) {
      return { ok: true, ong: data };
    } else {
      return { ok: false, mensaje: "Datos inválidos" };
    }
  } catch  {
    return { ok: false, mensaje: "Error de red o servidor" };
  }
};
