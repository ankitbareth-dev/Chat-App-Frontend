import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export const CTA = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".cta-item", {
        scrollTrigger: { trigger: containerRef.current, start: "top 85%" },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, containerRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        {/* Asymmetric Grid Layout: 12 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left: Call to Action Text (Spans 7 columns) */}
          <div className="md:col-span-7 cta-item translate-y-10 opacity-0 group relative">
            <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-deep)] p-12 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-[var(--brand-primary)]/30">
              {/* Subtle Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--brand-primary)]/10 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                  Ready to <br />
                  <span className="text-[var(--brand-primary)]">
                    start chatting?
                  </span>
                </h2>
                <p className="text-lg text-[var(--text-muted)] max-w-md mb-10 leading-relaxed">
                  Join thousands of users who have switched to a better way to
                  chat. It's free, secure, and just works.
                </p>

                <button
                  className="w-fit flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] px-10 py-4 text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] cursor-pointer"
                  onClick={() => navigate("/auth")}
                >
                  Start Chatting Now <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Visual Action Card (Spans 5 columns) */}
          <div className="md:col-span-5 cta-item translate-y-10 opacity-0 group">
            <div className="h-full rounded-3xl border border-white/10 bg-[var(--bg-surface)]/60 flex items-center justify-center relative overflow-hidden shadow-xl hover:bg-[var(--bg-surface)] transition-all duration-500">
              {/* Background Pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, var(--text-main) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {/* Pulsing Glow */}
              <div className="absolute inset-0 bg-[var(--brand-accent)]/10 blur-[80px] rounded-full animate-pulse pointer-events-none" />

              {/* Center Icon */}
              <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--brand-primary)] to-[var(--brand-accent)] shadow-[0_0_40px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform duration-500">
                <Send className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
