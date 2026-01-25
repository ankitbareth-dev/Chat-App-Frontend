import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Lock, Globe, Smartphone, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const Features = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: (
        <Zap className="h-10 w-10 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
      ),
      title: "Lightning Fast",
      desc: "Built on WebSocket for sub-millisecond latency. Experience real-time communication like never before.",
      highlight: "10ms Latency",
    },
    {
      icon: (
        <Lock className="h-10 w-10 text-[var(--brand-primary)] drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
      ),
      title: "End-to-End Encryption",
      desc: "Your conversations are protected with military-grade security. Only you and the recipient can read messages.",
      highlight: "256-bit AES",
    },
    {
      icon: (
        <Globe className="h-10 w-10 text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
      ),
      title: "Cross Platform",
      desc: "Available on Web, iOS, and Android seamlessly. Your chats sync instantly across all your devices.",
      highlight: "99.9% Uptime",
    },
    {
      icon: (
        <Smartphone className="h-10 w-10 text-pink-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]" />
      ),
      title: "Mobile First",
      desc: "Optimized for touch interactions and mobile data usage. A native app feel right in your browser.",
      highlight: "Progressive Web App",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-[var(--bg-deep)]"
    >
      {/* 1. Background Grid Pattern (Gives it that 'tech' filled look) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 2. Background Glows (Fills the empty space with color) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand-primary)]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-accent)]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
            Why Choose Chat
            <span className="text-[var(--brand-primary)]">Flow</span>?
          </h2>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
            Engineered for performance, designed for humans. Experience the next
            generation of digital communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative p-8 rounded-3xl border border-white/5 bg-[var(--bg-surface)]/60 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-[var(--brand-primary)]/50 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] hover:-translate-y-2"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>

                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--brand-primary)] group-hover:to-white transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--text-muted)] leading-relaxed text-sm mb-4">
                    {feature.desc}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--brand-primary)] uppercase tracking-wider bg-[var(--brand-primary)]/10 px-2 py-1 rounded">
                    {feature.highlight}
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[var(--brand-primary)] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
