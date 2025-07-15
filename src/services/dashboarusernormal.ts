

export async function ActualizarPerfil(file: File | undefined, token?: string) {
  if (!file) throw new Error("Archivo no proporcionado");

  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};

  const fetchOptions: RequestInit = {
    method: 'POST',
    body: formData,
    headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    fetchOptions.credentials = 'omit';
  } else {
    fetchOptions.credentials = 'include';
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/foto`, fetchOptions);
  if (!res.ok) throw new Error('Error al actualizar la foto de perfil');
}




interface UsuarioUpdateData {
  email?: string;
  contrasena?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
}

export async function ActualizarUsuario(datos: UsuarioUpdateData, token?: string) {
console.log('soy el token que viajo en actualizar DatosPerfil: ' + token);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/me`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    method: 'PATCH',
    headers,
    body: JSON.stringify(datos),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    fetchOptions.credentials = 'omit';
  } else {
    fetchOptions.credentials = 'include';
  }

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    throw new Error('Error al actualizar usuario');
  }
        console.log("Status ActualizarPerfil:", res.status);
  console.log("Headers ActualizarPerfil:", [...res.headers.entries()]);

  return res.json();
}
