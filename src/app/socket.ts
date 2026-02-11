import { io, Socket } from "socket.io-client";
import { ENV } from "./env";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(ENV.API_BASE_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};
