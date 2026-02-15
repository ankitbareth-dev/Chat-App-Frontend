import { Features } from "./Features";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { Navbar } from "./Navbar";
import { TechStack } from "./TechStack";

const LandingPageWrapper = () => {
  return (
    <div className="min-h-screen font-sans text-[var(--text-main)] relative overflow-hidden">
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPageWrapper;
