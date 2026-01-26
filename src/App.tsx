import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Testimonials } from "./components/Testimonials";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen font-sans text-[var(--text-main)] relative overflow-hidden">
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
