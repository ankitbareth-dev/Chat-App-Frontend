import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPageWrapper from "./features/landing/LandingPageWrapper";
import AuthPage from "./features/auth/AuthPage";
import ChatLayout from "./features/chat/ChatLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { checkAuth } from "./features/auth/authSlice";
import { selectAuth } from "./features/auth/authSlice";
import { useEffect, useRef } from "react";
import SplashScreen from "./components/SplashScreen";

import { connectSocket, disconnectSocket } from "./app/socket";
import { Toaster } from "sonner";
import {
  handleIncomingMessage,
  selectChat,
  updateUserStatus,
  setMessagesSeen,
} from "./features/chat/chatSlice";

function App() {
  const dispatch = useAppDispatch();
  const { initialLoading, isAuthenticated } = useAppSelector(selectAuth);
  const { activeChatUser } = useAppSelector(selectChat);

  const activeChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeChatIdRef.current = activeChatUser?.id || null;
  }, [activeChatUser]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    const onConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const onDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("user_status", (data) => {
      dispatch(updateUserStatus(data));
    });

    socket.on("receive_message", (newMessage) => {
      const isActiveChat = activeChatIdRef.current === newMessage.senderId;

      if (!isActiveChat) {
        dispatch(handleIncomingMessage(newMessage));
      }
    });

    socket.on("messages_seen", (data) => {
      dispatch(setMessagesSeen(data));
    });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("user_status");
      socket.off("receive_message");
      socket.off("messages_seen");
    };
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      disconnectSocket();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (initialLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPageWrapper />
            </PublicRoute>
          }
        />
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <ChatLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
