import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPageWrapper from "./features/landing/LandingPageWrapper";
import AuthPage from "./features/auth/AuthPage";
import ChatLayout from "./features/chat/ChatLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/chat" element={<ChatLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
