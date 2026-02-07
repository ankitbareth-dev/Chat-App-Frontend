import { useEffect, useRef, useState } from "react";
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
  const [, forceRender] = useState(0); // used only to re-render provider

  useEffect(() => {
    // ⛔ wait until auth hydration finishes
    if (initialLoading) return;

    // 🔴 user logged out → disconnect once
    if (!isAuthenticated) {
      if (socketRef.current) {
        console.log("🔌 Disconnecting socket (logout)");
        socketRef.current.disconnect();
        socketRef.current = null;
        forceRender((x) => x + 1);
      }
      return;
    }

    // 🟢 user logged in → connect once
    if (!socketRef.current) {
      console.log("🔌 Connecting socket...");

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
      forceRender((x) => x + 1);
    }
  }, [isAuthenticated, initialLoading]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
