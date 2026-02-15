import { UserPlus, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);

  useOnClickOutside(navRef, () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  });

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[97%] max-w-7xl z-50"
    >
      {/* Main Navbar Container */}
      <div className="flex items-center justify-between px-6 md:px-8 h-[60px] rounded-2xl border border-white/10 bg-[var(--bg-card)] backdrop-blur-xl shadow-xl">
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

        {/* Desktop Middle links */}
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

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Desktop Button */}
          <button
            className="hidden md:flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/30 transition-all hover:scale-105 cursor-pointer"
            onClick={() => navigate("/auth")}
          >
            <UserPlus className="h-4 w-4" />
            Get Started
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="mt-2 md:hidden rounded-2xl border border-white/10 bg-[var(--bg-card)] backdrop-blur-xl shadow-xl p-6 flex flex-col gap-4 animate-fade-in-up">
          {/* Mobile Links */}
          {["Features", "Security", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-[var(--text-muted)] hover:text-white transition-colors py-2 border-b border-white/5 last:border-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}

          {/* Mobile Button */}
          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--brand-primary)]/30 transition-all hover:scale-105 cursor-pointer mt-2"
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate("/auth");
            }}
          >
            <UserPlus className="h-4 w-4" />
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};
