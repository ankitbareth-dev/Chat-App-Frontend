import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import { ENV } from "../app/env";

interface Props {
  children: React.ReactNode;
}

const SocketProvider = ({ children }: Props) => {
  const { isAuthenticated, initialLoading } = useAppSelector(selectAuth);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (initialLoading) return;

    if (!isAuthenticated) {
      if (socketRef.current) {
        console.log("🔌 Disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    if (!socketRef.current) {
      console.log("🔌 Connecting socket");

      const socket = io(ENV.API_BASE_URL, {
        withCredentials: true,
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected");
      });

      socket.on("connect_error", (err) => {
        console.error("❌ Socket error:", err.message);
      });

      socketRef.current = socket;
    }
  }, [isAuthenticated, initialLoading]);

  return (
    // eslint-disable-next-line react-hooks/refs
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
