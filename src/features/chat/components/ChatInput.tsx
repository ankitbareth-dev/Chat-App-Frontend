import { Send } from "lucide-react";

type ChatInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
};

const ChatInput = ({ value, onChange, onSend }: ChatInputProps) => {
  return (
    <div className="p-4 border-t border-white/5 bg-[var(--bg-deep)] h-[78px] flex items-center">
      <div className="flex items-center gap-3 bg-[var(--bg-surface)] rounded-xl p-2 w-full">
        <input
          type="text"
          placeholder="Type a message..."
          value={value}
          onChange={onChange}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          className="flex-1 bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm outline-none px-3 py-1"
        />
        <button
          onClick={onSend}
          className="p-2 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white transition-colors disabled:opacity-50"
          disabled={!value.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
