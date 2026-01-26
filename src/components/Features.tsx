import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MessageSquare,
  Lock,
  RefreshCw,
  Smartphone,
  ArrowRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".feature-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
      });
    }, containerRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  // Main Feature (Large Card)
  const mainFeature = {
    icon: (
      <RefreshCw className="h-24 w-24 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.3)]" />
    ),
    title: "Real-Time Updates",
    desc: "Messages appear instantly using WebSocket technology. Experience sub-millisecond latency that makes the distance between you and your friends disappear. No refreshing, just flowing conversation.",
    highlight: "10ms Latency",
  };

  // Secondary Features (Compact List)
  const secondaryFeatures = [
    {
      icon: <Lock className="h-12 w-12 text-[var(--brand-primary)]" />,
      title: "Privacy First",
      desc: "Military-grade encryption ensures your conversations are yours alone.",
      stat: "256-bit AES",
    },
    {
      icon: <MessageSquare className="h-12 w-12 text-green-400" />,
      title: "Searchable History",
      desc: "Find any past conversation in seconds with our advanced indexing.",
      stat: "Cloud Sync",
    },
    {
      icon: <Smartphone className="h-12 w-12 text-pink-400" />,
      title: "Anywhere Access",
      desc: "Your chats sync across Phone, Tablet, and Desktop automatically.",
      stat: "Multi-Device",
    },
  ];

  return (
    <section ref={containerRef} className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 feature-item translate-y-10 opacity-0">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Engineered for{" "}
            <span className="text-[var(--brand-primary)]">Performance</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            We reimagined how chat should feel. Faster, safer, and undeniably
            smooth.
          </p>
        </div>

        {/* Bento Grid Layout: 12 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: The "Hero" Card (Spans 7 columns) */}
          <div className="feature-item lg:col-span-7 translate-y-10 opacity-0 group relative">
            <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-deep)] p-10 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-[var(--brand-primary)]/30 hover:-translate-y-1">
              {/* Background Glow Effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="mb-8">{mainFeature.icon}</div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    {mainFeature.title}
                  </h3>
                  <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-md">
                    {mainFeature.desc}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/5">
                  <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-wider">
                    {mainFeature.highlight}
                  </span>
                  <div className="flex items-center gap-2 text-[var(--brand-primary)] font-medium group-hover:translate-x-2 transition-transform">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Secondary Features Stack (Spans 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {secondaryFeatures.map((item, index) => (
              <div
                key={index}
                className="feature-item flex-1 translate-y-10 opacity-0 group relative"
              >
                <div className="h-full rounded-2xl border border-white/10 bg-[var(--bg-surface)]/60 p-6 shadow-lg hover:bg-[var(--bg-surface)] transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <div className="flex flex-col h-full justify-between relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      {item.icon}
                      <span className="text-[10px] font-mono text-[var(--text-muted)] border border-white/10 px-2 py-1 rounded bg-black/20">
                        {item.stat}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Hover Effect Line */}
                    <div className="w-0 h-0.5 bg-[var(--brand-primary)] mt-4 transition-all duration-300 group-hover:w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
