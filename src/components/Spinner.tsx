const Spinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-deep)]">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[var(--brand-primary)] border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.3)]"></div>
      <p className="mt-4 text-[var(--text-muted)] text-sm animate-pulse">
        Verifying session...
      </p>
    </div>
  );
};

export default Spinner;
