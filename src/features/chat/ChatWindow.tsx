import {
  Send,
  Phone,
  Video,
  MoreHorizontal,
  Smile,
  Search,
  User,
  Archive,
  Paperclip,
  Plus,
} from "lucide-react";
import { useContext, useEffect, useState, useRef } from "react";
import { SocketContext } from "../../context/SocketContext";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addMessage, selectChat, setTyping } from "./chatSlice";
import { selectAuth } from "../auth/authSlice";
import type { ChatMessage } from "../../types/chat.types";

const ChatWindow = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();

  const { activeChatUser, messages, isTyping } = useAppSelector(selectChat);
  const { user: currentUser } = useAppSelector(selectAuth);

  const [input, setInput] = useState("");
  const typingTimeout = useRef<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  /* --- Scroll to bottom --- */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* --- Socket listeners --- */
  useEffect(() => {
    if (!socket || !activeChatUser) return;

    const handleMessage = (message: ChatMessage) => {
      dispatch(addMessage(message));
    };

    const handleTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === activeChatUser.id) {
        dispatch(setTyping(true));
      }
    };

    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      if (senderId === activeChatUser.id) {
        dispatch(setTyping(false));
      }
    };

    socket.on("receive_message", handleMessage);
    socket.on("user_typing", handleTyping);
    socket.on("user_stopped_typing", handleStopTyping);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("user_typing", handleTyping);
      socket.off("user_stopped_typing", handleStopTyping);
    };
  }, [socket, activeChatUser, dispatch]);

  /* --- Typing logic --- */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (!socket || !activeChatUser) return;

    if (value) {
      socket.emit("start_typing", { receiverId: activeChatUser.id });

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      typingTimeout.current = window.setTimeout(() => {
        socket.emit("stop_typing", { receiverId: activeChatUser.id });
      }, 1000);
    } else {
      socket.emit("stop_typing", { receiverId: activeChatUser.id });
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    }
  };

  /* --- Helper --- */
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  /* --- Empty State --- */
  if (!activeChatUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-deep)] text-center p-6">
        <div className="w-20 h-20 bg-[var(--bg-surface)] rounded-full flex items-center justify-center mb-4">
          <div className="text-3xl">💬</div>
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">
          ChatApp Web
        </h2>
        <p className="text-[var(--text-muted)]">
          Select a user from the search results to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-deep)] h-full">
      {/* Header */}
      <div className="h-16 bg-[var(--bg-surface)] border-b border-white/5 flex items-center justify-between px-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--brand-accent)] flex items-center justify-center text-white font-semibold overflow-hidden">
            {activeChatUser.profilePicture ? (
              <img
                src={activeChatUser.profilePicture}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(activeChatUser.name)
            )}
          </div>

          <div>
            <div className="text-sm font-semibold text-[var(--text-main)]">
              {activeChatUser.name}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              {isTyping ? "typing..." : `${activeChatUser.phone} • Online`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-[var(--text-muted)]" />
          <Video className="h-5 w-5 text-[var(--text-muted)]" />
          <Phone className="h-5 w-5 text-[var(--text-muted)]" />

          <div className="relative">
            <button onClick={() => setShowDropdown((p) => !p)}>
              <MoreHorizontal className="h-5 w-5 text-[var(--text-muted)]" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] rounded-lg border border-white/10 shadow-lg">
                <button className="w-full flex gap-3 px-3 py-2 text-sm hover:bg-white/10">
                  <User className="h-4 w-4" /> My Profile
                </button>
                <button className="w-full flex gap-3 px-3 py-2 text-sm hover:bg-white/10">
                  <Archive className="h-4 w-4" /> Archived
                </button>
                <button className="w-full px-3 py-2 text-sm hover:bg-white/10 text-left">
                  Delete Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-deep)]">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[65%] rounded-lg px-4 py-2 ${
                    isMe
                      ? "bg-[#00a884] text-white"
                      : "bg-[var(--bg-card)] text-[var(--text-main)]"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div className="flex justify-end gap-1 mt-1 text-[11px] text-[var(--text-muted)]">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {isMe && <span>✔✔</span>}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-2 bg-[var(--bg-surface)] flex items-center gap-2">
        <Smile className="h-5 w-5 text-[var(--text-muted)]" />
        <Paperclip className="h-5 w-5 text-[var(--text-muted)]" />
        <Plus className="h-5 w-5 text-[var(--text-muted)]" />

        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="flex-1 bg-[var(--bg-deep)] px-3 py-2 rounded-lg outline-none text-[var(--text-main)]"
        />

        <button className="p-2 bg-[var(--brand-primary)] rounded-full text-white">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
