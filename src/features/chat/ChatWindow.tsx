import { MessageCircle } from "lucide-react";

const ChatWindow = () => {
  return (
    <main className="flex-1 h-full bg-[var(--bg-deep)] flex flex-col items-center justify-center p-6 text-center">
      {/* Decorative Icon Container */}
      <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6 ring-1 ring-white/10">
        <MessageCircle className="h-10 w-10 text-[var(--text-muted)]" />
      </div>

      {/* Main Heading */}
      <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">
        Your Messages
      </h2>

      {/* Subtext */}
      <p className="text-[var(--text-muted)] max-w-md">
        Select a friend from your sidebar to start a new conversation.
      </p>
    </main>
  );
};

export default ChatWindow;
