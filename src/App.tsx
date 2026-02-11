import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPageWrapper from "./features/landing/LandingPageWrapper";
import AuthPage from "./features/auth/AuthPage";
import ChatLayout from "./features/chat/ChatLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { checkAuth } from "./features/auth/authSlice";
import { selectAuth } from "./features/auth/authSlice";
import { useEffect } from "react";
import SplashScreen from "./components/SplashScreen";

import { connectSocket, disconnectSocket } from "./app/socket";

function App() {
  const dispatch = useAppDispatch();
  const { initialLoading, isAuthenticated } = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const socket = connectSocket();

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated]);

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
