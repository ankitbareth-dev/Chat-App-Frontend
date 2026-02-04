import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPageWrapper from "./features/landing/LandingPageWrapper";
import AuthPage from "./features/auth/AuthPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
