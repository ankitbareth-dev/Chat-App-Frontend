const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-deep)] transition-opacity duration-500">
      <div className="relative flex items-center justify-center">
        <img
          src="/App-Logo.png"
          alt="App Logo"
          className="relative z-10 h-32 w-32 object-contain animate-float rounded-2xl"
          style={{ filter: "drop-shadow(0 0 10px rgba(99,102,241,0.3))" }}
        />

        <div className="absolute inset-0 h-32 w-32 rounded-full border border-[var(--brand-primary)] border-t-transparent animate-spin opacity-30"></div>
        <div className="absolute inset-[-10px] h-40 w-40 rounded-full bg-[var(--brand-primary)] opacity-5 blur-xl animate-glow"></div>
      </div>

      <p className="mt-8 text-[var(--text-muted)] text-sm animate-pulse font-medium tracking-wide">
        Initializing experience...
      </p>
    </div>
  );
};

export default SplashScreen;
