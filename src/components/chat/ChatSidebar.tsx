'use client';

import { useEffect, useState, useRef } from 'react';
import { connectSocket } from '@/lib/socket';
import {
  obtenerChatsDeOng,
  obtenerChatsDeUsuario,
  iniciarChat,
  obtenerUsuariosDisponibles,
  obtenerOngsDisponibles,
} from '@/services/chatService';

interface Chat {
  id: string;
  usuarioId: string;
  organizacionId: string;
  usuario?: { id: string; nombre: string };
  organizacion?: { id: string; nombre: string };
  ultimoMensaje?: string;
}

interface Destinatario {
  id: string;
  nombre: string;
  conectado: boolean;
}

interface ChatSidebarProps {
  esOng: boolean;
  userId: string;
  onSelectChat: (chatId: string) => void;
}

export default function ChatSidebar({
  esOng,
  userId,
  onSelectChat,
}: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');


  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchChats() {
      setLoading(true);
      setError(null);
      try {
        const data = esOng
          ? await obtenerChatsDeOng(userId)
          : await obtenerChatsDeUsuario(userId);
        setChats(data.chats || []);
      } catch {
        setError('Error cargando chats');
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, [esOng, userId]);

  // Socket listeners para actualizar chats y estado usuarios
  useEffect(() => {
  const socket = connectSocket();

  // Registramos usuario al conectarse
  socket.emit('identify',{userId});

  const handleNewMessage = (mensaje: { chatId: string; contenido: string }) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === mensaje.chatId
          ? { ...chat, ultimoMensaje: mensaje.contenido }
          : chat
      )
    );
  };

  const handleEstadoUsuarios = (usuarios: { id: string; conectado: boolean }[]) => {
    console.log('🟢 Usuarios conectados desde backend:', usuarios); // DEBUG acá
    setDestinatarios((prev) =>
      prev.map((dest) => {
        const actualizado = usuarios.find((u) => u.id === dest.id);
        return actualizado ? { ...dest, conectado: actualizado.conectado } : dest;
      })
    );
  };

  socket.on('messageReceived', handleNewMessage);
  socket.on('estadoUsuarios', handleEstadoUsuarios);

  return () => {
    socket.off('messageReceived', handleNewMessage);
    socket.off('estadoUsuarios', handleEstadoUsuarios);
  };
}, [userId]);


  const handleToggleDropdown = async () => {
    if (mostrarDropdown) {
      setMostrarDropdown(false);
      return;
    }
    try {
      const data = esOng
        ? await obtenerUsuariosDisponibles()
        : await obtenerOngsDisponibles();

      setDestinatarios(data || []);
      setMostrarDropdown(true);
      const socket = connectSocket();
      socket.emit("solicitarEstadoUsuarios");
    } catch {
      alert('Error al cargar destinatarios');
    }
  };

  const handleSeleccionarDestinatario = async (destinatarioId: string) => {
    try {
      const res = esOng
        ? await iniciarChat(destinatarioId, userId)
        : await iniciarChat(userId, destinatarioId);
      onSelectChat(res.chat.id);
      setMostrarDropdown(false);
    } catch {
      alert('Error al iniciar chat');
    }
  };

  return (
    <aside className="w-120 border-r border-gray-200 p-4 flex flex-col bg-white shadow-sm">
      <button
        onClick={handleToggleDropdown}
        className="mb-4 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition-colors"
      >
        {mostrarDropdown ? "Cerrar lista" : "Iniciar nuevo chat"}
      </button>

      {mostrarDropdown && (
        <div
          ref={dropdownRef}
          className="mb-4 max-h-60 overflow-y-auto border border-pink-300 rounded-lg shadow-sm bg-white"
        >
          {destinatarios.length === 0 ? (
            <p className="p-4 text-center text-gray-500 text-sm">
              No hay destinatarios disponibles
            </p>
          ) : (
            <ul>
              {destinatarios.map((dest) => (
                <li
                  key={dest.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-pink-50 cursor-pointer transition-colors"
                  onClick={() => handleSeleccionarDestinatario(dest.id)}
                >
                  <span className="text-sm font-medium text-gray-800">
                    {dest.nombre}
                  </span>
                  <span
                    className={`ml-2 w-3 h-3 rounded-full ${
                      dest.conectado ? "bg-green-500" : "bg-red-500"
                    }`}
                    title={dest.conectado ? "Conectado" : "Desconectado"}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <input
        type="text"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Buscar por nombre..."
        className="mb-4 px-3 py-2 text-sm border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      {loading ? (
        <div className="text-sm text-gray-500">Cargando chats...</div>
      ) : error ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : chats.length === 0 ? (
        <div className="text-sm text-gray-500">No tienes chats activos</div>
      ) : (
        <ul className="flex-grow overflow-auto max-h-[calc(100vh-20rem)] space-y-3 pr-1">
          
{chats
  .filter((chat) => {
    const nombre =
      chat.usuarioId === userId
        ? chat.organizacion?.nombre || ''
        : chat.usuario?.nombre || '';
    return nombre.toLowerCase().includes(filtro.toLowerCase());
  })
  .map((chat) => {
    const otroNombre =
      chat.usuarioId === userId
        ? chat.organizacion?.nombre || 'Sin nombre'
        : chat.usuario?.nombre || 'Sin nombre';

    const inicial = otroNombre.charAt(0).toUpperCase();

    return (
      <li
        key={chat.id}
        className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
        onClick={() => onSelectChat(chat.id)}
      >
        {/* Avatar inicial */}
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-sm flex-shrink-0">
          {inicial}
        </div>

        {/* Nombre y mensaje */}
        <div className="flex flex-col overflow-hidden">
          <strong className="truncate text-sm text-gray-900">{otroNombre}</strong>
          <p className="text-xs text-gray-600 truncate">
            {chat.ultimoMensaje || 'Sin mensajes aún'}
          </p>
        </div>
      </li>
    );
  })}

        </ul>
      )}
    </aside>
  );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { getSocket, connectSocket } from '@/lib/socket';
// import {
//   obtenerChatsDeOng,
//   obtenerChatsDeUsuario,
//   iniciarChat,
//   obtenerUsuariosDisponibles,
//   obtenerOngsDisponibles,
// } from '@/services/chatService';

// interface Chat {
//   id: string;
//   usuarioId: string;
//   organizacionId: string;
//   usuario?: { id: string; nombre: string };
//   organizacion?: { id: string; nombre: string };
//   ultimoMensaje?: string;
// }

// interface Destinatario {
//   id: string;
//   nombre: string;
//   conectado: boolean;
// }

// interface ChatSidebarProps {
//   esOng: boolean;
//   userId: string;
//   onSelectChat: (chatId: string) => void;
// }

// export default function ChatSidebar({
//   esOng,
//   userId,
//   onSelectChat,
// }: ChatSidebarProps) {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [destinatarios, setDestinatarios] = useState<Destinatario[]>([]);
//   const [mostrarDestinatarios, setMostrarDestinatarios] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchChats() {
//       setLoading(true);
//       setError(null);
//       try {
//         const data = esOng
//           ? await obtenerChatsDeOng(userId)
//           : await obtenerChatsDeUsuario(userId);
//         setChats(data.chats || []);
//       } catch {
//         setError('Error cargando chats');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchChats();
//   }, [esOng, userId]);

//   // Escuchar nuevos mensajes para actualizar preview
//  useEffect(() => {
//   const socket = connectSocket();

//   // Registramos usuario para que backend sepa quién está conectado
//   socket.emit('registrarUsuario', userId);

//   // Listener para mensajes nuevos
//   const handleNewMessage = (mensaje: { chatId: string; contenido: string }) => {
//     setChats((prevChats) =>
//       prevChats.map((chat) =>
//         chat.id === mensaje.chatId
//           ? { ...chat, ultimoMensaje: mensaje.contenido }
//           : chat
//       )
//     );
//   };

//   // Listener para estado de usuarios conectados
//   const handleEstadoUsuarios = (usuarios: { id: string; conectado: boolean }[]) => {
//     console.log('🟢 Evento estadoUsuarios recibido:', usuarios); // para debug
//     setDestinatarios((prev) =>
//       prev.map((dest) => {
//         const actualizado = usuarios.find((u) => u.id === dest.id);
//         return actualizado ? { ...dest, conectado: actualizado.conectado } : dest;
//       })
//     );
//   };

//   socket.on('messageReceived', handleNewMessage);
//   socket.on('estadoUsuarios', handleEstadoUsuarios);

//   return () => {
//     socket.off('messageReceived', handleNewMessage);
//     socket.off('estadoUsuarios', handleEstadoUsuarios);
//   };
// }, [userId]);

  

//   const handleIniciarChat = async () => {
//     try {
//       const data = esOng
//         ? await obtenerUsuariosDisponibles()
//         : await obtenerOngsDisponibles();

//       setDestinatarios(data || []);
//       setMostrarDestinatarios(true);
//     } catch {
//       alert('Error al cargar destinatarios');
//     }
//   };

//   const handleSeleccionarDestinatario = async (destinatarioId: string) => {
//     try {
//       const res = esOng
//         ? await iniciarChat(destinatarioId, userId)
//         : await iniciarChat(userId, destinatarioId);
//       onSelectChat(res.chat.id);
//       setMostrarDestinatarios(false);
//     } catch {
//       alert('Error al iniciar chat');
//     }
//   };

//   return (
//     <aside className="w-64 border-r p-4 flex flex-col bg-white">
//       <button
//         onClick={handleIniciarChat}
//         className="mb-4 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded"
//       >
//         Iniciar nuevo chat
//       </button>

//       {mostrarDestinatarios && (
//         <div className="mb-4 p-2 border bg-white rounded shadow">
//           <p className="font-bold mb-2">Elegí con quién chatear:</p>
//           <ul className="space-y-1">
//             {destinatarios.map((dest) => (
//               <li key={dest.id} className="flex items-center justify-between">
//                 <button
//                   className="text-blue-600 hover:underline"
//                   onClick={() => handleSeleccionarDestinatario(dest.id)}
//                 >
//                   {dest.nombre}
//                 </button>
//                 <span
//                   className={`ml-2 w-2 h-2 rounded-full ${
//                     dest.conectado ? 'bg-green-500' : 'bg-red-500'
//                   }`}
//                   title={dest.conectado ? 'Conectado' : 'Desconectado'}
//                 ></span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {loading ? (
//         <div>Cargando chats...</div>
//       ) : error ? (
//         <div className="text-red-600">{error}</div>
//       ) : chats.length === 0 ? (
//         <div>No tienes chats activos</div>
//       ) : (
//         <ul className="flex-grow overflow-auto">
//           {chats.map((chat) => {
//             const otroNombre =
//               chat.usuarioId === userId
//                 ? chat.organizacion?.nombre || 'Sin nombre'
//                 : chat.usuario?.nombre || 'Sin nombre';

//             return (
//               <li
//                 key={chat.id}
//                 className="p-2 border-b cursor-pointer hover:bg-pink-50"
//                 onClick={() => onSelectChat(chat.id)}
//               >
//                 <strong>{otroNombre}</strong>
//                 <p className="text-sm text-gray-600 truncate">
//                   {chat.ultimoMensaje || ''}
//                 </p>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </aside>
//   );
// }



