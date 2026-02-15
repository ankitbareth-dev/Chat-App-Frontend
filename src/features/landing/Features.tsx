import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Lock, Eye, CheckCheck, History, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-item",
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        },
      );
    }, containerRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Zap className="h-10 w-10 text-yellow-400" />,
      title: "Real-Time Messaging",
      desc: "Messages delivered instantly using persistent WebSocket connection.",
    },
    {
      icon: <Lock className="h-10 w-10 text-green-400" />,
      title: "Private 1-to-1 Chat",
      desc: "Secure communication between users.",
    },
    {
      icon: <Eye className="h-10 w-10 text-blue-400" />,
      title: "Online Status",
      desc: "See when users are active.",
    },
    {
      icon: <CheckCheck className="h-10 w-10 text-purple-400" />,
      title: "Message Delivery Status",
      desc: "Sent, delivered, seen indicators.",
    },
    {
      icon: <History className="h-10 w-10 text-pink-400" />,
      title: "Persistent Chat History",
      desc: "Messages stored and loaded efficiently.",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-cyan-400" />,
      title: "Modern UI",
      desc: "Clean, responsive interface.",
    },
  ];

  return (
    <section id="features" ref={containerRef} className="py-4 relative z-10">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 px-4">
          <h2
            className="
  text-[clamp(2rem,5vw,3.75rem)]
  font-bold
  tracking-tight
  text-white
  leading-tight
  max-w-3xl
  mx-auto
"
          >
            Built for Fast, Private{" "}
            <span className="text-[var(--brand-primary)]">Conversations</span>
          </h2>

          <p
            className="
    mt-4
    text-sm
    sm:text-base
    md:text-lg
    text-[var(--text-muted)]
    max-w-xl
    mx-auto
    leading-relaxed
  "
          >
            Everything you need for seamless communication, wrapped in a
            beautiful interface.
          </p>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="feature-item translate-y-10 opacity-0 group"
            >
              <div className="h-full rounded-2xl border border-white/10 bg-[var(--bg-surface)]/60 p-6 shadow-lg hover:bg-[var(--bg-surface)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[var(--brand-primary)]/30">
                {/* Icon Container */}
                <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/5 inline-block">
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {item.desc}
                </p>

                {/* Decorative Bottom Line */}
                <div className="w-0 h-0.5 bg-[var(--brand-primary)] mt-6 transition-all duration-300 group-hover:w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
