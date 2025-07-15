'use client';

import { useEffect, useState } from 'react';
import { useOngAuth } from '@/context/OngAuthContext';
import { useUsuarioAuth } from '@/context/UsuarioAuthContext';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import { useAuth } from '@/components/SupabaseProvider';
import { fetchConToken } from '@/services/saveToken';

export default function ChatPage() {
  const { ong } = useOngAuth();
  const { usuario } = useUsuarioAuth();
  const { user, token: supabaseToken } = useAuth();

  const [chatIdSeleccionado, setChatIdSeleccionado] = useState<string | null>(null);
  const [uidSync, setUidSync] = useState<string>('');

  // Determinar el tipo de usuario
  const esOng = !!ong;
  const esUsuarioLocal = !!usuario && !user; // Solo si no hay sesión Supabase
  const esUsuarioSupabase = !!user;

  // Obtener el userId dependiendo del tipo de usuario
  let userId = '';
  if (esOng && ong?.id) {
    userId = ong.id;
  } else if (esUsuarioLocal && usuario?.id) {
    userId = usuario.id;
  } else if (esUsuarioSupabase && uidSync) {
    userId = uidSync;
  }

  // Obtener nombre del autor
  const autorNombre =
    ong?.nombre ||
    usuario?.nombre ||
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    'Usuario sin nombre';

  // Obtener ID desde Supabase si aplica
  useEffect(() => {
    const obtenerUid = async () => {
      if (supabaseToken && esUsuarioSupabase) {
        try {
          const data = await fetchConToken(supabaseToken);
          if (data?.id) {
            console.log('User ID desde Supabase token:', data.id);
            setUidSync(data.id);
          }
        } catch (error) {
          console.error('Error al sincronizar ID:', error);
        }
      }
    };

    obtenerUid();
  }, [supabaseToken, esUsuarioSupabase]);

  // Mostrar mensaje si el ID de usuario no está disponible
  if (!userId) {
    return (
      <div className="text-center py-8 text-gray-600">
        Cargando datos de usuario...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar
        esOng={esOng}
        userId={userId}
        onSelectChat={setChatIdSeleccionado}
      />
      {chatIdSeleccionado && (
        <ChatWindow
          chatId={chatIdSeleccionado}
          autorId={userId}
          autorNombre={autorNombre}
        />
      )}
    </div>
  );
}
