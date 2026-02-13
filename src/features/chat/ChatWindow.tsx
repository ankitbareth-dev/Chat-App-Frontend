import { MessageCircle, Phone, Video, MoreVertical, Send } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { selectChat } from "./chatSlice";
import { useEffect, useState, useRef } from "react";
import { getSocket } from "../../app/socket";
import TypingIndicator from "../../components/TypingIndicator";

const ChatWindow = () => {
  const { activeChatUser } = useAppSelector(selectChat);

  const [message, setMessage] = useState("");

  const [isRemoteTyping, setIsRemoteTyping] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeChatUser) return;

    const handleUserTyping = (data: { senderId: string }) => {
      if (data.senderId === activeChatUser.id) {
        setIsRemoteTyping(true);
      }
    };

    const handleUserStoppedTyping = (data: { senderId: string }) => {
      if (data.senderId === activeChatUser.id) {
        setIsRemoteTyping(false);
      }
    };

    socket.on("user_typing", handleUserTyping);
    socket.on("user_stopped_typing", handleUserStoppedTyping);

    return () => {
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stopped_typing", handleUserStoppedTyping);
      setIsRemoteTyping(false);
    };
  }, [activeChatUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    const socket = getSocket();
    if (!socket || !activeChatUser) return;

    socket.emit("start_typing", { receiverId: activeChatUser.id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { receiverId: activeChatUser.id });
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      const socket = getSocket();
      if (socket && activeChatUser) {
        socket.emit("stop_typing", { receiverId: activeChatUser.id });
      }
    };
  }, [activeChatUser]);

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
    <main className="flex-1 h-full bg-[var(--bg-deep)] flex flex-col relative">
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-end">
        {/* 
           We place the indicator at the bottom of the chat area, 
           just above where the new message would appear.
        */}
        {isRemoteTyping && (
          <div className="flex justify-start mb-4 animate-fade-in-up">
            <TypingIndicator />
          </div>
        )}

        {/* Placeholder text if no messages exist yet */}
        <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
          {!isRemoteTyping && <p>Chat history will appear here.</p>}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-[var(--bg-deep)]">
        <div className="flex items-center gap-3 bg-[var(--bg-surface)] rounded-xl p-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
            className="flex-1 bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm outline-none px-3 py-1"
          />
          <button
            className="p-2 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChatWindow;
