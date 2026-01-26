import { MessageSquare } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-deep)] border-t border-white/5 h-32 flex items-center justify-center relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center gap-2">
          {/* Brand + Icon */}
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[var(--brand-primary)]" />
            <span className="text-xl font-bold tracking-tight text-white">
              Chat<span className="text-[var(--brand-primary)]">Flow</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-[var(--text-muted)] max-w-lg">
            Connect instantly with the people who matter most. Secure, fast, and
            simple.
          </p>

          {/* Copyright */}
          <p className="text-xs text-[var(--text-muted)]/50">
            © {currentYear} ChatFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
