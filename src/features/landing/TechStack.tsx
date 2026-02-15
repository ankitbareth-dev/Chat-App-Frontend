import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code, Server, Database, Cloud } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const TechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tech-header",
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        ".tech-card",
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const categories = [
    {
      title: "Frontend",
      icon: <Code className="h-8 w-8 text-blue-400" />,
      items: ["React", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
      gradient: "from-blue-500/10 to-transparent",
      borderHover: "hover:border-blue-500/30",
    },
    {
      title: "Backend",
      icon: <Server className="h-8 w-8 text-green-400" />,
      items: ["Node.js", "TypeScript", "Express", "Socket.IO"],
      gradient: "from-green-500/10 to-transparent",
      borderHover: "hover:border-green-500/30",
    },
    {
      title: "Database",
      icon: <Database className="h-8 w-8 text-purple-400" />,
      items: ["PostgreSQL"],
      gradient: "from-purple-500/10 to-transparent",
      borderHover: "hover:border-purple-500/30",
    },
    {
      title: "Deployment",
      icon: <Cloud className="h-8 w-8 text-pink-400" />,
      items: ["Render"],
      gradient: "from-pink-500/10 to-transparent",
      borderHover: "hover:border-pink-500/30",
    },
  ];

  return (
    <section id="tech-stack" ref={containerRef} className="py-10 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="tech-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            Built With Modern{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]">
              Technologies
            </span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            A robust stack selected for performance, maintainability, and
            scalability.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="tech-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`tech-card group relative rounded-2xl border border-white/10 bg-[var(--bg-surface)]/40 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 ${category.borderHover}`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 transition-colors group-hover:bg-white/10">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {category.title}
                </h3>
              </div>

              {/* Tech Items List */}
              <div className="space-y-3">
                {category.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)] opacity-70"></div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Decorative Gradient */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
