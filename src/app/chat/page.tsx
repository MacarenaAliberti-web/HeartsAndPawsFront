
'use client';

import { useState } from 'react';
import { useOngAuth } from '@/context/OngAuthContext';
import { useUsuarioAuth } from '@/context/UsuarioAuthContext';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatPage() {
  const { ong } = useOngAuth();
  const { usuario } = useUsuarioAuth();
  const [chatIdSeleccionado, setChatIdSeleccionado] = useState<string | null>(null);

  if (!ong && !usuario) return <div>Cargando...</div>;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar
        esOng={!!ong}
        userId={ong?.id || usuario?.id || ''}
        onSelectChat={setChatIdSeleccionado}
      />
      {chatIdSeleccionado && (
        <ChatWindow
  chatId={chatIdSeleccionado}
  autorId={ong?.id || usuario?.id || ''}
  autorNombre={ong?.nombre || usuario?.nombre || ''}
/>

      )}
    </div>
  );
}
