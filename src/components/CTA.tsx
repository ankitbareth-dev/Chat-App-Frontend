import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const CTA = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cta-content", {
        scrollTrigger: { trigger: containerRef.current, start: "top 70%" },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24">
      <div className="container mx-auto px-6">
        <div className="cta-content relative rounded-3xl overflow-hidden bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] p-12 text-center shadow-2xl shadow-[var(--brand-primary)]/40">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to upgrade your chat?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
              Start building with ChatFlow today. No credit card required for
              the first 14 days.
            </p>
            <button className="flex items-center justify-center gap-2 mx-auto rounded-full bg-[var(--bg-deep)] px-8 py-4 text-white font-bold hover:bg-[var(--bg-surface)] transition-all hover:scale-105">
              Get Started Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
