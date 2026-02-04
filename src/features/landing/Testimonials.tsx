import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Zap, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const Testimonials = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".highlight-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
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

  const mainBenefit = {
    icon: (
      <Heart className="h-20 w-20 text-red-400 drop-shadow-[0_0_20px_rgba(248,113,113,0.3)]" />
    ),
    title: "Ad-Free Experience",
    desc: "Enjoy uninterrupted conversations. We believe messaging should be peaceful, clutter-free, and entirely focused on you. No distractions, just connection.",
    tag: "Zero Distractions",
  };

  const technicalSpecs = [
    {
      icon: <Zap className="h-12 w-12 text-yellow-400" />,
      title: "Minimal Latency",
      desc: "Built for speed. From typing to delivery, the experience feels instant.",
      stat: "< 100ms",
    },
    {
      icon: <ShieldCheck className="h-12 w-12 text-green-400" />,
      title: "Reliable",
      desc: "Robust infrastructure ensures your messages are always delivered on time.",
      stat: "99.99% Uptime",
    },
  ];

  return (
    <section ref={containerRef} className="py-32 relative z-10">
      <div className="container mx-auto px-6">
        {/* Title - Animate this too */}
        <div className="text-center mb-16 highlight-item translate-y-10 opacity-0">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Why Chat<span className="text-[var(--brand-primary)]">Flow</span>?
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            Built for people who value their time, privacy, and peace of mind.
          </p>
        </div>

        {/* Bento Grid Layout: 12 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: The "Hero" Benefit Card (Spans 7 columns) */}
          <div className="highlight-item lg:col-span-7 translate-y-10 opacity-0 group relative">
            <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-deep)] p-10 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-red-400/30 hover:-translate-y-1">
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-400/5 blur-[120px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full justify-center text-center lg:text-left">
                <div className="mb-8">{mainBenefit.icon}</div>
                <h3 className="text-3xl font-bold mb-4 text-white">
                  {mainBenefit.title}
                </h3>
                <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-md mb-8">
                  {mainBenefit.desc}
                </p>

                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-400/10 border border-red-400/20 text-sm font-bold text-red-300">
                  {mainBenefit.tag}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Stacked Technical Cards (Spans 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {technicalSpecs.map((item, index) => (
              <div
                key={index}
                className="highlight-item flex-1 translate-y-10 opacity-0 group relative"
              >
                <div className="h-full rounded-2xl border border-white/10 bg-[var(--bg-surface)]/60 p-8 shadow-lg hover:bg-[var(--bg-surface)] transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                  <div className="flex flex-col h-full justify-between relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      {item.icon}
                      <span className="text-[10px] font-mono text-[var(--text-muted)] border border-white/10 px-2 py-1 rounded bg-black/20">
                        {item.stat}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Decorative Line */}
                    <div className="w-12 h-1 bg-white/10 rounded-full mt-6 group-hover:w-full group-hover:bg-[var(--brand-primary)] transition-all duration-500"></div>
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
