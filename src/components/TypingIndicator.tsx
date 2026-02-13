const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-[var(--bg-surface)] rounded-full">
      <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce"></span>
    </div>
  );
};

export default TypingIndicator;
