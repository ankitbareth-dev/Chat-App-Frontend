import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const Testimonials = () => {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testi-head", {
        scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".testi-card", {
        scrollTrigger: { trigger: sliderRef.current, start: "top 85%" },
        x: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--brand-accent)]/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 testi-head">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by Developers
          </h2>
          <p className="text-[var(--text-muted)] text-lg">
            Join thousands of teams building better communication.
          </p>
        </div>

        <div ref={sliderRef} className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="testi-card p-8 rounded-3xl bg-[var(--bg-surface)] border border-white/5 shadow-2xl relative"
            >
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-[var(--text-muted)] mb-6 italic">
                "This is by far the best chat solution we've used. The latency
                is virtually zero and the API is a joy to work with."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500"></div>
                <div>
                  <div className="font-bold text-white">Sarah Jenkins</div>
                  <div className="text-xs text-[var(--brand-primary)]">
                    CTO at TechStart
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
