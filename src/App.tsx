import { Features } from "./components/Features";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Testimonials } from "./components/Testimonials";

function App() {
  return (
    <div className="min-h-screen font-sans text-[var(--text-main)] bg-[var(--bg-deep)]">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
      </main>
    </div>
  );
}

export default App;
