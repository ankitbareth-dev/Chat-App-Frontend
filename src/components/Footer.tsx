export const Footer = () => {
  return (
    <footer className="bg-[var(--bg-deep)] border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white">
              Chat<span className="text-[var(--brand-primary)]">Flow</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm">
              Connecting the world one message at a time with state-of-the-art
              technology.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>
                <a href="#" className="hover:text-[var(--brand-primary)]">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--brand-primary)]">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--brand-primary)]">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>
                <a href="#" className="hover:text-[var(--brand-primary)]">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--brand-primary)]">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--brand-primary)]">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>
                <a href="#" className="hover:text-[var(--brand-primary)]">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--brand-primary)]">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © 2024 ChatFlow Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-[var(--text-muted)]">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
