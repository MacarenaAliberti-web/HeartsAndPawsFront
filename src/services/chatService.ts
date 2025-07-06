
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const iniciarChat = async (usuarioId: string, organizacionId: string) => {
  const res = await fetch(`${API_URL}/chats/iniciar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ usuarioId, organizacionId }),
  });
  if (!res.ok) throw new Error('No se pudo iniciar el chat');
  return res.json();
};

export const obtenerChatsDeUsuario = async (usuarioId: string) => {
  const res = await fetch(`${API_URL}/chats/usuario/${usuarioId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener chats del usuario');
  return res.json();
};

export const obtenerChatsDeOng = async (ongId: string) => {
  const res = await fetch(`${API_URL}/chats/organizacion/${ongId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener chats de la ONG');
  return res.json();
};

export const obtenerMensajes = async (chatId: string) => {
  const res = await fetch(`${API_URL}/chats/${chatId}/mensajes`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener mensajes');
  return res.json();
};

export const obtenerUsuariosDisponibles = async () => {
  const res = await fetch(`${API_URL}/chats/usuarios`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener usuarios disponibles');
  return res.json(); // devuelve un array de usuarios
};

export const obtenerOngsDisponibles = async () => {
  const res = await fetch(`${API_URL}/chats/organizaciones`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener organizaciones disponibles');
  return res.json(); // devuelve un array de ongs
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
