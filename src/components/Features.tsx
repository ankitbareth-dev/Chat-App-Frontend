import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Lock, Globe, Smartphone } from "lucide-react";

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
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: "Lightning Fast",
      desc: "Built on WebSocket for sub-millisecond latency.",
    },
    {
      icon: <Lock className="h-8 w-8 text-[var(--brand-primary)]" />,
      title: "End-to-End Encryption",
      desc: "Your conversations are protected with military-grade security.",
    },
    {
      icon: <Globe className="h-8 w-8 text-green-400" />,
      title: "Cross Platform",
      desc: "Available on Web, iOS, and Android seamlessly.",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-pink-400" />,
      title: "Mobile First",
      desc: "Optimized for touch interactions and mobile data usage.",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="py-24 bg-[var(--bg-deep)] relative z-10"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose ChatFlow?
          </h2>
          <p className="text-[var(--text-muted)] text-lg">
            Engineered for performance, designed for humans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group p-8 rounded-3xl border border-white/5 bg-[var(--bg-surface)]/50 hover:bg-[var(--bg-surface)] hover:border-[var(--brand-primary)]/30 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="mb-6 p-4 rounded-2xl bg-[var(--bg-deep)] group-hover:bg-[var(--brand-primary)]/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
