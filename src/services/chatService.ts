
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const iniciarChat = async (
  usuarioId:string,
  organizacionId: string,
  token?: string
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({ usuarioId, organizacionId }),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    fetchOptions.credentials = 'omit';
  } else {
    fetchOptions.credentials = 'include';
  }

  const res = await fetch(`${API_URL}/chats/iniciar`, fetchOptions);
  if (!res.ok) throw new Error('No se pudo iniciar el chat');
  return res.json();
};



export const obtenerChatsDeUsuario = async (
  usuarioId: string,
  token?: string 
) => {
  const headers: Record<string, string> = {};

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

  const res = await fetch(`${API_URL}/chats/usuario/${usuarioId}`, fetchOptions);
  console.log('soy respuesta: ' + JSON.stringify(res));
  if (!res.ok) throw new Error('Error al obtener chats del usuario');
  return res.json();
};


export const obtenerChatsDeOng = async (ongId: string, token?: string) => {
  const headers: Record<string, string> = {};

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

  const res = await fetch(`${API_URL}/chats/organizacion/${ongId}`, fetchOptions);
  if (!res.ok) throw new Error('Error al obtener chats de la ONG');
  return res.json();
};


export const iniciarChatComoOng = async (
  usuarioId: string,
  organizacionId: string,
  token: string
) => {
   const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify({ usuarioId, organizacionId }),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    fetchOptions.credentials = 'omit';
  } else {
    fetchOptions.credentials = 'include';
  }

  const res = await fetch(`${API_URL}/chats/iniciar`, fetchOptions);
  if (!res.ok) throw new Error('No se pudo iniciar el chat');
  return res.json();
};

export const obtenerMensajes = async ( token: string | undefined, chatId: string) => {
  const headers: Record<string, string> = {};

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

  const res = await fetch(`${API_URL}/chats/${chatId}/mensajes`, fetchOptions);
  if (!res.ok) throw new Error('Error al obtener chats de la ONG');
  return res.json();
};

export const obtenerUsuariosDisponibles = async (token?: string) => {
  const headers: Record<string, string> = {};

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

  const res = await fetch(`${API_URL}/chats/usuarios`, fetchOptions);
  if (!res.ok) throw new Error('Error al obtener usuarios disponibles');
  return res.json(); 
};


export const obtenerOngsDisponibles = async (token?: string) => {
  const headers: Record<string, string> = {};

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

  const res = await fetch(`${API_URL}/chats/organizaciones`, fetchOptions); 
  if (!res.ok) throw new Error('Error al obtener usuarios disponibles');
  return res.json(); 
};

















// const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// export const iniciarChat = async (usuarioId: string, organizacionId: string) => {
//   const res = await fetch(`${API_URL}/chats/iniciar`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify({ usuarioId, organizacionId }),
//   });
//   if (!res.ok) throw new Error('No se pudo iniciar el chat');
//   return res.json();
// };

// export const obtenerChatsDeUsuario = async (usuarioId: string) => {
//   const res = await fetch(`${API_URL}/chats/usuario/${usuarioId}`, {
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error('Error al obtener chats del usuario');
//   return res.json();
// };

// export const obtenerChatsDeOng = async (ongId: string) => {
//   const res = await fetch(`${API_URL}/chats/organizacion/${ongId}`, {
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error('Error al obtener chats de la ONG');
//   return res.json();
// };

// export const obtenerMensajes = async (chatId: string) => {
//   const res = await fetch(`${API_URL}/chats/${chatId}/mensajes`, {
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error('Error al obtener mensajes');
//   return res.json();
// };

// export const obtenerUsuariosDisponibles = async () => {
//   const res = await fetch(`${API_URL}/chats/usuarios`, {
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error('Error al obtener usuarios disponibles');
//   return res.json(); // devuelve un array de usuarios
// };

// export const obtenerOngsDisponibles = async () => {
//   const res = await fetch(`${API_URL}/chats/organizaciones`, {
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error('Error al obtener organizaciones disponibles');
//   return res.json(); // devuelve un array de ongs
// };
