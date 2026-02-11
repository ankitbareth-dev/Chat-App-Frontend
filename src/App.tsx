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

function App() {
  const dispatch = useAppDispatch();
  const { initialLoading } = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

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
