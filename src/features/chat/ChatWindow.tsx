import { MessageCircle, Phone, Video, MoreVertical } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { selectChat } from "./chatSlice";

const ChatWindow = () => {
  const { activeChatUser } = useAppSelector(selectChat);

  if (!activeChatUser) {
    return (
      <main className="flex-1 h-full bg-[var(--bg-deep)] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6 ring-1 ring-white/10">
          <MessageCircle className="h-10 w-10 text-[var(--text-muted)]" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">
          Your Messages
        </h2>
        <p className="text-[var(--text-muted)] max-w-md">
          Select a friend from your sidebar to start a new conversation.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 h-full bg-[var(--bg-deep)] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <img
            src={activeChatUser.profilePicture}
            alt={activeChatUser.name}
            className="h-12 w-12 rounded-full object-cover border border-white/10"
          />
          <div>
            <h3 className="font-bold text-lg text-[var(--text-main)]">
              {activeChatUser.name}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {activeChatUser.phone}
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

      <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
        <p>Chat history will appear here.</p>
      </div>
    </main>
  );
};

export default ChatWindow;
