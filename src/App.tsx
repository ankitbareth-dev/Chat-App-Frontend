import { Features } from "./components/Features";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen font-sans text-[var(--text-main)] bg-[var(--bg-deep)]">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
}

export default App;
