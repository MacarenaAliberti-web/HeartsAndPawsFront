"use client";

import { useEffect, useState, useRef } from "react";
import { connectSocket } from "@/lib/socket";
import {
  obtenerChatsDeOng,
  obtenerChatsDeUsuario,
  iniciarChat,
  obtenerUsuariosDisponibles,
  obtenerOngsDisponibles,
  iniciarChatComoOng,
} from "@/services/chatService";
import { useAuth } from "../SupabaseProvider";

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

interface Chat {
  id: string;
  usuarioId: string;
  organizacionId: string;
  usuario?: { id: string; nombre: string };
  organizacion?: {
    id: string;
    nombre: string;
    email?: string;
    imagenPerfil?: string | null;
  };
  ultimoMensaje?: {
    id: string;
    contenido: string;
    enviado_en: string;
    autor: {
      id: string;
      nombre: string;
    };
  } | null;
  ultimoMensajeId?: string | null;
  creado_en?: string;
}
interface MensajeNuevo {
  chatId: string;
  contenido: string;
  id: string;
  enviado_en: string;
  autor: {
    id: string;
    nombre: string;
  };
}


export default function ChatSidebar({ esOng, userId, onSelectChat }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const { token } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) {
      console.warn("No hay userId disponible todavía");
      return;
    }

    const fetchChats = async () => {
  try {
    setLoading(true);
    setError(null);

    console.log("📦 Cargando chats con:", { userId, token, esOng });

    const data = esOng
      ? await obtenerChatsDeOng(userId, token!)
      : await obtenerChatsDeUsuario(userId, token!);

    console.log("✅ Chats recibidos:", data);
    setChats(data?.chats || []);
  } catch (err) {
    console.error("❌ Error al obtener chats:", err);

    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Error desconocido al cargar chats");
    }
  } finally {
    setLoading(false);
  }
};
    fetchChats();
  }, [esOng, userId, token]);

  useEffect(() => {
    if (!userId || !token) return;

    const socket = connectSocket();
    socket.emit("identify", { userId, token });

    const handleNewMessage = (mensaje:MensajeNuevo ) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === mensaje.chatId ? { ...chat, ultimoMensaje: mensaje } : chat
        )
      );
    };

    const handleEstadoUsuarios = (usuarios: Destinatario []) => {
      setDestinatarios((prev) =>
        prev.map((dest) => {
          const actualizado = usuarios.find((u) => u.id === dest.id);
          return actualizado
            ? { ...dest, conectado: actualizado.conectado }
            : dest;
        })
      );
    };

    socket.on("messageReceived", handleNewMessage);
    socket.on("estadoUsuarios", handleEstadoUsuarios);

    return () => {
      socket.off("messageReceived", handleNewMessage);
      socket.off("estadoUsuarios", handleEstadoUsuarios);
    };
  }, [userId, token]);

  const handleToggleDropdown = async () => {
    if (mostrarDropdown) {
      setMostrarDropdown(false);
      return;
    }

    try {
      const data = esOng
        ? await obtenerUsuariosDisponibles(token!)
        : await obtenerOngsDisponibles(token!);

      setDestinatarios(data || []);
      setMostrarDropdown(true);

      const socket = connectSocket();
      socket.emit("solicitarEstadoUsuarios");
    } catch {
      alert("Error al cargar destinatarios");
    }
  };

  const handleSeleccionarDestinatario = async (destinatarioId: string) => {
    try {
      const res = esOng
        ? await iniciarChatComoOng(destinatarioId, userId, token!)
        : await iniciarChat(userId, destinatarioId, token!);

      onSelectChat(res.chat.id);
      setMostrarDropdown(false);
    } catch (error) {
      console.error("Error iniciando chat:", error);
      alert("Error al iniciar chat");
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
                  <span className="text-sm font-medium text-gray-800">{dest.nombre}</span>
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
        <div className="text-sm text-red-600">⚠️ {error}</div>
      ) : chats.length === 0 ? (
        <div className="text-sm text-gray-500">No tienes chats activos</div>
      ) : (
        <ul className="flex-grow overflow-auto max-h-[calc(100vh-20rem)] space-y-3 pr-1">
          {chats
            .filter((chat) => {
              const nombre =
                chat.usuarioId === userId
                  ? chat.organizacion?.nombre || ""
                  : chat.usuario?.nombre || "";
              return nombre.toLowerCase().includes(filtro.toLowerCase());
            })
            .map((chat) => {
              const otroNombre =
                chat.usuarioId === userId
                  ? chat.organizacion?.nombre || "Sin nombre"
                  : chat.usuario?.nombre || "Sin nombre";

              const inicial = otroNombre.charAt(0).toUpperCase();

              return (
                <li
                  key={chat.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-sm flex-shrink-0">
                    {inicial}
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <strong className="truncate text-sm text-gray-900">{otroNombre}</strong>
                    <p className="text-xs text-gray-600 truncate">
                      {chat.ultimoMensaje?.contenido || "Sin mensajes aún"}
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
