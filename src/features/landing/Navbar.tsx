import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[97%] max-w-7xl h-[60px] z-50 rounded-2xl border border-white/10 bg-[var(--bg-card)] backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between px-8 h-full">
        {/* Logo section */}
        <div className="flex items-center gap-2">
          <img
            src="/App-Logo.jpg"
            alt="ChatFlow Logo"
            className="w-[55px] h-[55px] object-contain rounded-md flex-shrink-0"
          />
          <span className="text-lg font-bold tracking-tight text-white leading-none">
            Chat<span className="text-[var(--brand-primary)]">Flow</span>
          </span>
        </div>

        {/* Middle links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Security", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors relative pb-1 group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--brand-primary)] group-hover:w-full transition-all duration-300 ease-in-out"></span>
            </a>
          ))}
        </div>

        {/* Button */}
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/30 transition-all hover:scale-105 cursor-pointer"
            onClick={() => navigate("/auth")}
          >
            <UserPlus className="h-4 w-4" />
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};
