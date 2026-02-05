import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, Shield, Zap, MoreHorizontal, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(
          ".hero-badges",
          { opacity: 0, scale: 0.9, duration: 0.8 },
          "-=0.6",
        )
        .from(
          ".hero-ui",
          { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6",
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[100vh] flex items-center justify-center pt-32 pb-12 overflow-hidden"
    >
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6 text-center lg:text-left">
          <div className="hero-title text-4xl md:text-6xl font-bold leading-tight">
            Real-time chat, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] via-purple-400 to-[var(--brand-accent)]">
              simplified.
            </span>
          </div>

          <p className="hero-subtitle text-base md:text-lg text-[var(--text-muted)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Connect with friends and colleagues instantly. Experience a fast,
            secure, and seamless messaging platform designed for modern web.
          </p>

          <div className="hero-badges flex flex-wrap justify-center lg:justify-start gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white">
              <Shield className="h-3 w-3 text-green-400" /> End-to-End Encrypted
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white">
              <Zap className="h-3 w-3 text-yellow-400" /> Lightning Fast
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white">
              Cloud Synced
            </div>
          </div>

          {/* Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <button
              className="flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-8 py-3 text-white font-bold transition-all hover:bg-[var(--brand-accent)] shadow-lg shadow-[var(--brand-primary)]/20 cursor-pointer"
              onClick={() => navigate("/auth")}
            >
              Start Chatting <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="hero-ui relative group perspective-1000 hidden lg:block">
          <div className="relative rounded-3xl border border-white/10 bg-[var(--bg-surface)]/80 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 border-2 border-[var(--bg-surface)] flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    SJ
                  </div>
                  {/* Online Status Dot */}
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[var(--bg-surface)]"></div>
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">
                    Sarah Jenkins
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">Online</div>
                </div>
              </div>
              <button className="text-[var(--text-muted)] hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body - Compressed height for viewport */}
            <div className="space-y-4">
              {/* Message Received */}
              <div className="flex items-end gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                  SJ
                </div>
                <div className="bg-[var(--bg-deep)]/50 p-3 rounded-2xl rounded-bl-none border border-white/5 max-w-[85%]">
                  <p className="text-sm text-gray-200">
                    Hey! Have you tried the new update?
                  </p>
                </div>
              </div>

              {/* Message Sent */}
              <div className="flex items-end gap-3 flex-row-reverse">
                <div className="h-8 w-8 rounded-full bg-[var(--brand-primary)] border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                  Me
                </div>
                <div className="bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] p-3 rounded-2xl rounded-br-none shadow-lg shadow-[var(--brand-primary)]/25 max-w-[85%]">
                  <p className="text-sm text-white font-medium">
                    Yeah, the new interface is clean!
                  </p>
                  <div className="flex justify-end gap-1 mt-1">
                    <span className="text-[10px] text-white/70">10:24 AM</span>
                  </div>
                </div>
              </div>

              {/* Typing Indicator */}
              <div className="flex items-end gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                  SJ
                </div>
                <div className="bg-[var(--bg-deep)]/50 px-5 py-3 rounded-2xl rounded-bl-none border border-white/5">
                  <div className="flex gap-1.5 items-center h-5">
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="mt-6 relative">
              <input
                type="text"
                placeholder="Type a message..."
                disabled
                className="w-full rounded-xl bg-[var(--bg-deep)]/50 border border-white/10 px-5 py-3 text-sm text-white focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
              />
              <button className="absolute right-1.5 top-1.5 h-9 w-9 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center text-white shadow-lg hover:bg-[var(--brand-accent)] transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute -inset-4 bg-[var(--brand-primary)]/20 blur-xl rounded-[3rem] -z-10" />
        </div>
      </div>
    </section>
  );
};
