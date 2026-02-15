import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Monitor,
  Wifi,
  Server,
  Database,
  User,
  ArrowRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-header", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".flow-item", {
        scrollTrigger: {
          trigger: ".flow-container",
          start: "top 75%",
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.7)",
      });
    }, containerRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      icon: <Monitor className="h-8 w-8" />,
      label: "Frontend",
      color: "text-blue-400",
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      label: "WebSocket",
      color: "text-yellow-400",
    },
    {
      icon: <Server className="h-8 w-8" />,
      label: "Server",
      color: "text-purple-400",
    },
    {
      icon: <Database className="h-8 w-8" />,
      label: "Database",
      color: "text-green-400",
    },
    {
      icon: <User className="h-8 w-8" />,
      label: "Receiver",
      color: "text-pink-400",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="py-32 relative z-10 bg-[var(--bg-deep)]/50"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="section-header text-center mb-20 flex flex-col items-center">
          <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-bold tracking-tight text-white leading-tight max-w-3xl text-center mb-6">
            Powered by Modern{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]">
              Real-Time Architecture
            </span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-3xl leading-relaxed text-center">
            ChatFlow uses{" "}
            <span className="text-white font-medium">Socket.IO</span> to
            maintain persistent connections between client and server, enabling
            instant message delivery without the overhead of HTTP polling.
          </p>
        </div>

        {/* Visual Flow Diagram */}
        <div className="flow-container flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center items-center"
            >
              {/* The Node */}

              <div className="flow-item relative flex flex-col items-center group">
                <div
                  className={`relative p-5 rounded-2xl bg-[var(--bg-surface)] border border-white/10 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-white/20 group-hover:shadow-2xl ${step.color}`}
                >
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 rounded-2xl bg-current opacity-0 group-hover:opacity-10 blur-xl transition-opacity"></div>
                  <div className="relative z-10">{step.icon}</div>
                </div>

                <span className="relative md:absolute md:top-full md:left-1/2 md:-translate-x-1/2 mt-3 md:mt-3 text-sm font-medium text-[var(--text-muted)] group-hover:text-white transition-colors whitespace-nowrap">
                  {step.label}
                </span>
              </div>

              {/* Desktop Arrow (Rendered between items) */}
              {index < steps.length - 1 && (
                <div className="flow-item hidden md:flex mx-3 text-[var(--text-muted)]">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}

              {/* Mobile Arrow (Vertical) */}
              {index < steps.length - 1 && (
                <div className="flow-item md:hidden rotate-90 my-2 text-[var(--text-muted)]">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Technical Sub-text */}
        <div className="section-header mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-[var(--text-muted)]">
              Persistent TCP Connection · Low Latency · Event-Driven
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
