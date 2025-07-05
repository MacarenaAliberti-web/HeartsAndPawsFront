'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatSocket } from '@/hooks/useChatSocket';
import { Mensaje } from '@/types/chat';

interface ChatWindowProps {
  chatId: string;
  autorId: string;
  autorNombre: string; 
}

export default function ChatWindow({ chatId, autorId, autorNombre }: ChatWindowProps) {
  const [mensajesIniciales, setMensajesIniciales] = useState<Mensaje[]>([]);
  const [contenido, setContenido] = useState('');
  const { mensajes, enviarMensaje } = useChatSocket(chatId, autorId, autorNombre);



  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}/mensajes`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('Error al obtener mensajes');
        const data = await res.json();
        setMensajesIniciales(data.mensajes || []);
      } catch (error) {
        console.error('Error cargando mensajes iniciales:', error);
      }
    };

    fetchMensajes();
  }, [chatId]);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [mensajes, mensajesIniciales]);

  const handleEnviar = () => {
    if (!contenido.trim()) return;
    enviarMensaje(contenido);
    setContenido('');
  };

  const mensajesTotales = [...mensajesIniciales, ...mensajes];

  return (
    <div className="flex flex-col w-[1400px] h-[700px] mx-auto p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">

      {/* Mensajes */}
      <div
        ref={chatRef}
        className="flex-grow overflow-y-auto px-4 py-4 mb-3 bg-white rounded-md shadow space-y-3"
      >
        {mensajesTotales.map((msg) => {
          const esAutor = msg.autor?.id === autorId;
          const hora = msg.enviado_en
            ? new Date(msg.enviado_en).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

          return (
            <div
              key={msg.id}
              className={`max-w-full break-words rounded-lg px-4 py-3 text-sm
                ${esAutor ? 'bg-pink-200 self-end text-right' : 'bg-gray-200 self-start text-left'}
                shadow-sm
              `}
            >
              <div className="font-semibold mb-1">{msg.autor?.nombre || 'Anon'}</div>
              <div>{msg.contenido}</div>
              {hora && <div className="text-xs text-gray-500 mt-1">{hora}</div>}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleEnviar();
        }}
        className="flex gap-3 pt-1"
      >
        <input
          type="text"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-grow border border-gray-300 rounded-md px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-md transition"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}







// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { useChatSocket } from '@/hooks/useChatSocket';
// import { Mensaje } from '@/types/chat';

// interface ChatWindowProps {
//   chatId: string;
//   autorId: string;
// }

// export default function ChatWindow({ chatId, autorId }: ChatWindowProps) {
//   const [mensajesIniciales, setMensajesIniciales] = useState<Mensaje[]>([]);
//   const [contenido, setContenido] = useState('');
//   const { mensajes, enviarMensaje } = useChatSocket(chatId, autorId);

//   const chatRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchMensajes = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}/mensajes`,
//           { credentials: 'include' }
//         );
//         if (!res.ok) throw new Error('Error al obtener mensajes');
//         const data = await res.json();
//         setMensajesIniciales(data.mensajes || []);
//       } catch (error) {
//         console.error('Error cargando mensajes iniciales:', error);
//       }
//     };

//     fetchMensajes();
//   }, [chatId]);

//   useEffect(() => {
//     chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
//   }, [mensajes, mensajesIniciales]);

//   const handleEnviar = () => {
//     if (!contenido.trim()) return;
//     enviarMensaje(contenido);
//     setContenido('');
//   };

//   const mensajesTotales = [...mensajesIniciales, ...mensajes];

//   return (
//     <div className="flex flex-col h-full p-4 w-full bg-gray-50 rounded-lg shadow-md">
//       <div
//         ref={chatRef}
//         className="flex-grow overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4 bg-white scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-pink-100"
//       >
//         {mensajesTotales.map((msg) => {
//           let hora = '';
//           if (msg.enviado_en && !isNaN(Date.parse(msg.enviado_en))) {
//             hora = new Date(msg.enviado_en).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             });
//           }

//           // Diferenciar estilos si es autor "Yo" (id autor) o el otro
//           const esPropio = msg.autor?.nombre === 'Yo';

//           return (
//             <div
//               key={msg.id}
//               className={`mb-3 max-w-[80%] p-3 rounded-lg shadow-sm ${
//                 esPropio
//                   ? 'bg-pink-600 text-white self-end rounded-tr-none'
//                   : 'bg-pink-100 text-pink-900 self-start rounded-bl-none'
//               }`}
//             >
//               <div className="flex items-center justify-between text-sm font-semibold mb-1">
//                 <span>{esPropio ? 'Tú' : msg.autor?.nombre || 'Anon'}</span>
//                 {hora && (
//                   <span className="text-xs text-pink-300 ml-2 select-none">{hora}</span>
//                 )}
//               </div>
//               <p className="whitespace-pre-wrap">{msg.contenido}</p>
//             </div>
//           );
//         })}
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleEnviar();
//         }}
//         className="flex gap-2"
//       >
//         <input
//           type="text"
//           value={contenido}
//           onChange={(e) => setContenido(e.target.value)}
//           placeholder="Escribe un mensaje"
//           className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
//           autoComplete="off"
//         />
//         <button
//           type="submit"
//           className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors duration-200"
//         >
//           Enviar
//         </button>
//       </form>
//     </div>
//   );
// }











// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { useChatSocket } from '@/hooks/useChatSocket';
// import { Mensaje } from '@/types/chat';

// interface ChatWindowProps {
//   chatId: string;
//   autorId: string;
// }

// export default function ChatWindow({ chatId, autorId }: ChatWindowProps) {
//   const [mensajesIniciales, setMensajesIniciales] = useState<Mensaje[]>([]);
//   const [contenido, setContenido] = useState('');
//   const { mensajes, enviarMensaje } = useChatSocket(chatId, autorId);

//   const chatRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchMensajes = async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}/mensajes`,
//           { credentials: 'include' }
//         );
//         if (!res.ok) throw new Error('Error al obtener mensajes');
//         const data = await res.json();
//         setMensajesIniciales(data.mensajes || []);
//       } catch (error) {
//         console.error('Error cargando mensajes iniciales:', error);
//       }
//     };

//     fetchMensajes();
//   }, [chatId]);

//   useEffect(() => {
//     chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
//   }, [mensajes, mensajesIniciales]);

//   const handleEnviar = () => {
//     if (!contenido.trim()) return;
//     enviarMensaje(contenido);
//     setContenido('');
//   };

//  const mensajesTotales = [...mensajesIniciales, ...mensajes];

// useEffect(() => {
//   console.log('Mensajes totales:', mensajesTotales);
// }, [mensajesTotales]);

//   return (
//     <div className="flex flex-col h-full p-4 w-full">
//       <div
//         ref={chatRef}
//         className="flex-grow overflow-y-auto border rounded p-4 mb-4 bg-white"
//       >
//         {mensajesTotales.map((msg) => {
//           let hora = "";
//           if (msg.enviado_en && !isNaN(Date.parse(msg.enviado_en))) {
//             hora = new Date(msg.enviado_en).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             });
//           }

//           return (
//             <div key={msg.id} className="mb-2">
//               <strong>{msg.autor?.nombre || "Anon"}:</strong>{" "}
//               <span>{msg.contenido}</span>{" "}
//               {hora && (
//                 <span className="text-xs text-gray-500 ml-2">{hora}</span>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <div className="flex gap-2">
//         <input
//           type="text"
//           value={contenido}
//           onChange={(e) => setContenido(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               e.preventDefault();
//               handleEnviar();
//             }
//           }}
//           placeholder="Escribe un mensaje"
//           className="flex-grow border rounded px-2 py-1"
//         />
//         <button
//           onClick={handleEnviar}
//           className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1 rounded"
//         >
//           Enviar
//         </button>
//       </div>
//     </div>
//   );
// }
