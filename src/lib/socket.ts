import { io, Socket } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (!socket) {
    socket = io(`${URL}/ws-chat`, {
      withCredentials: true,
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;




