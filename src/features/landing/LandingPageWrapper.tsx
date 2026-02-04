import { CTA } from "./CTA";
import { Features } from "./Features";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Navbar } from "./Navbar";
import { Testimonials } from "./Testimonials";

const LandingPageWrapper = () => {
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
};

export default LandingPageWrapper;
