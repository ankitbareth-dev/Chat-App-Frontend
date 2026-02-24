const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-deep)] overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-primary)]/5 to-transparent" />

      {/* Atmospheric Glow */}
      <div className="absolute h-72 w-72 bg-[var(--brand-primary)] opacity-10 blur-[100px] rounded-full" />

      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* Logo Container with Spinner */}
        <div className="relative h-28 w-28 flex items-center justify-center">
          {/* Sleek Spinner Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--brand-primary)] border-r-[var(--brand-primary)] animate-spin duration-1000" />

          {/* Logo Image */}
          <img
            src="/App-Logo.png"
            alt="ChatFlow Logo"
            className="h-20 w-20 object-contain rounded-2xl shadow-2xl shadow-[var(--brand-primary)]/30 transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Chat<span className="text-[var(--brand-primary)]">Flow</span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm font-medium tracking-wider  animate-pulse">
            Loading Chats...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
