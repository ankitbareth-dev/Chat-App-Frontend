import { useState } from "react";
import { Send, MoreVertical, Phone, Video } from "lucide-react";

const DUMMY_MESSAGES = [
  {
    id: 1,
    sender: "them",
    text: "Hey! How is the project going?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "It's going great. Just finished the Splash Screen.",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "them",
    text: "That sounds awesome. Can't wait to see it!",
    time: "10:35 AM",
  },
  {
    id: 4,
    sender: "me",
    text: "I'll push the code in a bit.",
    time: "10:36 AM",
  },
  {
    id: 5,
    sender: "them",
    text: "Hey! Are we still on for the meeting?",
    time: "10:42 AM",
  },
];

const ChatWindow = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <main className="flex-1 flex flex-col h-full relative bg-[var(--bg-deep)]">
      {/* Chat Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            alt="User"
            className="h-10 w-10 rounded-full border border-white/10"
          />
          <div>
            <h3 className="font-semibold text-[var(--text-main)]">
              Alice Johnson
            </h3>
            <p className="text-xs text-[var(--brand-primary)] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)] animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] transition-colors">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] transition-colors">
            <Video className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {DUMMY_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.sender === "me"
                  ? "bg-[var(--brand-primary)] text-white rounded-tr-sm"
                  : "bg-[var(--bg-card)] border border-white/5 text-[var(--text-main)] rounded-tl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <span className={`text-[10px] block mt-1 text-right opacity-70`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-[var(--bg-surface)]">
        <div className="flex items-end gap-2 bg-[var(--bg-deep)] border border-white/10 rounded-2xl p-2 focus-within:border-[var(--brand-primary)] focus-within:ring-1 focus-within:ring-[var(--brand-primary)] transition-all shadow-lg">
          <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors rounded-full hover:bg-white/5">
            {/* Plus Icon SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <textarea
            className="flex-1 bg-transparent border-none focus:ring-0 text-[var(--text-main)] placeholder-[var(--text-muted)] resize-none py-2 max-h-32 text-sm"
            placeholder="Type a message..."
            rows={parseInt("1")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="p-2 bg-[var(--brand-primary)] hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all transform active:scale-95">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChatWindow;
