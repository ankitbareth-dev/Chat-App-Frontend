import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
        .from(
          ".hero-subtitle",
          { y: 30, opacity: 0, duration: 1, ease: "power3.out" },
          "-=0.8",
        )
        .from(
          ".hero-cta",
          { scale: 0.9, opacity: 0, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.7",
        )
        .from(
          ".hero-ui",
          {
            y: 100,
            opacity: 0,
            rotationX: 10,
            duration: 1.2,
            ease: "power3.out",
          },
          "-=1",
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[var(--brand-primary)]/20 blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[var(--brand-accent)]/20 blur-[128px]" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side: Text Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="hero-title text-5xl md:text-7xl font-bold leading-tight">
            Connect with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] via-purple-400 to-[var(--brand-accent)]">
              Absolute Speed
            </span>
          </div>
          <p className="hero-subtitle text-lg md:text-xl text-[var(--text-muted)] max-w-xl mx-auto lg:mx-0">
            A next-generation real-time chat platform built for developers,
            designed for speed, and secured with enterprise-grade encryption.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-[var(--bg-deep)] font-bold transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 backdrop-blur-sm transition-all hover:bg-white/10">
              View Demo
            </button>
          </div>
        </div>

        {/* Right Side: Abstract Chat UI Mock */}
        <div className="hero-ui relative group perspective-1000">
          <div className="relative rounded-3xl border border-white/10 bg-[var(--bg-surface)]/80 backdrop-blur-2xl p-6 shadow-2xl shadow-black/40 transform transition-transform duration-500 group-hover:translate-y-[-10px] group-hover:rotate-x-2">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                  JD
                </div>
                <div>
                  <div className="font-semibold text-white">John Doe</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />{" "}
                    Online
                  </div>
                </div>
              </div>
              <div className="text-[var(--text-muted)]">
                <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="space-y-4 min-h-[250px] flex flex-col justify-end">
              <div className="self-start max-w-[80%] bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                <p className="text-sm text-gray-300">
                  Hey! Have you seen the new updates on ChatFlow? It's
                  incredibly fast!
                </p>
              </div>

              <div className="self-end max-w-[80%] bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] p-4 rounded-2xl rounded-tr-none shadow-lg shadow-[var(--brand-primary)]/25">
                <p className="text-sm text-white font-medium">
                  Yes! I was just about to try it out. The UI is stunning.
                </p>
              </div>

              {/* Typing Indicator */}
              <div className="self-start flex items-center gap-1 ml-2 bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none">
                <div
                  className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>

            {/* Input Area */}
            <div className="mt-6 relative">
              <input
                type="text"
                placeholder="Type your message..."
                disabled
                className="w-full rounded-xl bg-[var(--bg-deep)]/50 border border-white/10 px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
              />
              <button className="absolute right-2 top-2 h-10 w-10 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center text-white shadow-lg hover:bg-[var(--brand-accent)] transition-colors">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Decorative Element behind card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] rounded-[2rem] -z-10 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
        </div>
      </div>
    </section>
  );
};
