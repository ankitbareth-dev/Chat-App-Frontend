import {
  MessageCircle,
  Phone,
  Video,
  MoreVertical,
  Send,
  Check,
  Clock,
} from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../auth/authSlice";
import { selectChat } from "./chatSlice";
import { useEffect, useState, useRef } from "react";
import { getSocket } from "../../app/socket";
import TypingIndicator from "../../components/TypingIndicator";

interface Message {
  id: string;
  tempId?: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string | Date;
  status?: "sending" | "sent";
}

const ChatWindow = () => {
  const { activeChatUser } = useAppSelector(selectChat);
  const { user } = useAppSelector(selectAuth);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeChatUser) return;

    const handleReceiveMessage = (newMessage: Message) => {
      if (newMessage.senderId === activeChatUser.id) {
        setMessages((prev) => [...prev, { ...newMessage, status: "sent" }]);
      }
    };

    const handleMessageSent = (confirmedMessage: Message) => {
      setMessages((prev) => {
        return prev.map((msg) =>
          msg.status === "sending" &&
          msg.content === confirmedMessage.content &&
          msg.senderId === user?.id
            ? { ...confirmedMessage, status: "sent" }
            : msg,
        );
      });
    };

    const handleErrorMessage = (errorMessage: string) => {
      console.error("Socket Error:", errorMessage);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);
    socket.on("error_message", handleErrorMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("error_message", handleErrorMessage);
    };
  }, [activeChatUser, user?.id]);

  useEffect(() => {
    setMessages([]);
  }, [activeChatUser?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    const socket = getSocket();
    if (!socket || !activeChatUser) return;

    socket.emit("start_typing", { receiverId: activeChatUser.id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { receiverId: activeChatUser.id });
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !activeChatUser || !user) return;

    const socket = getSocket();
    const tempId = `temp-${Date.now()}`;
    const messageContent = message;

    const optimisticMessage: Message = {
      id: tempId,
      tempId: tempId,
      senderId: user.id,
      receiverId: activeChatUser.id,
      content: messageContent,
      createdAt: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setMessage("");

    socket.emit("send_message", {
      receiverId: activeChatUser.id,
      content: messageContent,
    });

    socket.emit("stop_typing", { receiverId: activeChatUser.id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeChatUser) return;

    const handleUserTyping = (data: { senderId: string }) => {
      if (data.senderId === activeChatUser.id) setIsRemoteTyping(true);
    };
    const handleUserStoppedTyping = (data: { senderId: string }) => {
      if (data.senderId === activeChatUser.id) setIsRemoteTyping(false);
    };

    socket.on("user_typing", handleUserTyping);
    socket.on("user_stopped_typing", handleUserStoppedTyping);

    return () => {
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stopped_typing", handleUserStoppedTyping);
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
        {/* Header Icons */}
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

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && !isRemoteTyping && (
          <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
            <p>No messages yet. Say hi! 👋</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.senderId === user?.id;
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${
                  isMine
                    ? "bg-[var(--brand-primary)] text-white rounded-br-none"
                    : "bg-[var(--bg-surface)] text-[var(--text-main)] border border-white/5 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.content}</p>

                {/* Status Indicator (Only for my messages) */}
                {isMine && (
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {msg.status === "sending" ? (
                      <Clock className="h-3 w-3 opacity-70 animate-pulse" />
                    ) : (
                      <Check className="h-3 w-3 opacity-90" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Remote Typing Indicator */}
        {isRemoteTyping && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-[var(--bg-deep)]">
        <div className="flex items-center gap-3 bg-[var(--bg-surface)] rounded-xl p-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm outline-none px-3 py-1"
          />
          <button
            onClick={handleSendMessage}
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
