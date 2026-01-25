import { Sparkles } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-2xl border border-white/10 bg-[var(--bg-card)] backdrop-blur-xl shadow-2xl shadow-black/50">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          {/* React Logo Icon */}
          <svg
            className="h-8 w-8 text-cyan-400 animate-[spin_10s_linear_infinite]"
            viewBox="-11.5 -10.23174 23 20.46348"
          >
            <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
            <g stroke="#61DAFB" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
          <span className="text-xl font-bold tracking-tight text-white">
            Chat<span className="text-[var(--brand-primary)]">Flow</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it Works", "Pricing", "Community"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors">
            Log in
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/30 transition-all hover:scale-105">
            <Sparkles className="h-4 w-4" />
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};
