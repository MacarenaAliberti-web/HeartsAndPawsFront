export async function getMyUser(token?: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios/me`;
  console.log("Enviando token a getMyUser:", token);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const fetchOptions: RequestInit = {
      method: 'GET',
      headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      fetchOptions.credentials = 'omit';
    } else {
      fetchOptions.credentials = 'include';
    }

    const res = await fetch(url, fetchOptions);

    console.log('Response status:', res.status);

    if (!res.ok) {
      throw new Error('No se pudo obtener el usuario');
    }

    return res.json();

  } catch (error) {
    console.log('Error al obtener usuario:', error);
    return null;
  }
}
