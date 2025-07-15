'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatSocket } from '@/hooks/useChatSocket';
import { Mensaje } from '@/types/chat';
import { obtenerMensajes } from '@/services/chatService';
import { useAuth } from '../SupabaseProvider';

interface ChatWindowProps {
  chatId: string;
  autorId: string;
  autorNombre: string;
}

export default function ChatWindow({ chatId, autorId, autorNombre }: ChatWindowProps) {
  const [mensajesIniciales, setMensajesIniciales] = useState<Mensaje[]>([]);
  const [contenido, setContenido] = useState('');
  const { mensajes, enviarMensaje } = useChatSocket(chatId, autorId, autorNombre);
  const { token } = useAuth();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const res = await obtenerMensajes(token ?? undefined, chatId);
        setMensajesIniciales(res.mensajes || []);
      } catch (error) {
        console.error('Error cargando mensajes iniciales:', error);
      }
    };

    setMensajesIniciales([]); 
    fetchMensajes();
    setContenido(''); 
  }, [chatId, token]);

  
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
