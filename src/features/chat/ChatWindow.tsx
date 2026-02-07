import { Send, MoreVertical, Phone, Video } from "lucide-react";

const ChatWindow = () => {
  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-deep)] h-full">
      <div className="h-16 bg-[var(--bg-surface)] border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--brand-accent)] flex items-center justify-center text-white font-semibold overflow-hidden border border-white/10"></div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-main)]"></h3>
            <p className="text-xs text-[var(--text-muted)]">
              Click here for contact info
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[var(--text-muted)]">
          <Video className="h-5 w-5 cursor-pointer hover:text-white" />
          <Phone className="h-5 w-5 cursor-pointer hover:text-white" />
          <MoreVertical className="h-5 w-5 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-deep)]"></div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--bg-surface)] border-t border-white/10">
        <form className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 bg-[var(--bg-deep)] text-[var(--text-main)] px-4 py-2.5 rounded-full border border-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] placeholder-gray-500"
          />
          <button
            type="submit"
            className="p-3 bg-[var(--brand-primary)] text-white rounded-full hover:bg-[var(--brand-accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
