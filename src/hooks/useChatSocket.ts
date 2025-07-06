import { useEffect, useState } from 'react';
import { connectSocket, getSocket } from '@/lib/socket';
import { Mensaje } from '@/types/chat';
;


export function useChatSocket(chatId: string | null, autorId: string | null, autorNombre: string)
 {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);

  useEffect(() => {
    if (!chatId) return;

    setMensajes([]);

    const socket = connectSocket();

    socket.emit('joinchat', { chatId });

    const onMessageReceived = (mensaje: Mensaje) => {
      setMensajes((prev) => [...prev, mensaje]);
    };

    socket.on('messageReceived', onMessageReceived);

    return () => {
      socket.emit('leavechat', { chatId });
      socket.off('messageReceived', onMessageReceived);
    };
  }, [chatId]);

  const enviarMensaje = (contenido: string) => {
    if (!autorId || !chatId) {
      console.warn('autorId o chatId no definido');
      return;
    }

    const socket = getSocket();
    if (!socket || !socket.connected) {
      console.warn('Socket no conectado');
      return;
    }

    socket.emit('sendMessage', { chatId, autorId, contenido });

//     const mensajeLocal: Mensaje = {
//   id: `local-${Date.now()}`,
//   autor: { id: autorId, nombre: autorNombre }, // ← CAMBIO ACÁ
//   contenido,
//   enviado_en: new Date().toISOString(),
// };
//    setMensajes(prev => [...prev, mensajeLocal]);
//     socket.emit('sendMessage', { chatId, autorId, contenido });

  };

  return { mensajes, enviarMensaje };
}
