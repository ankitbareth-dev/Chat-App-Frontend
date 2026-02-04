import React, { useEffect, useRef, useState } from "react";
import { Send, MoreVertical, Phone, Video, MessageSquare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchMessages,
  sendMessage,
  selectChat,
} from "../../features/chat/chatSlice";

import type { RootState } from "../../app/store";

const ChatWindow = () => {
  const dispatch = useAppDispatch();
  const { activeChatUser, messages, isSending } = useAppSelector(selectChat);
  const { user: currentUser } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages when chat switches
  useEffect(() => {
    if (activeChatUser) {
      dispatch(fetchMessages({ receiverId: activeChatUser.id, page: 1 }));
    }
  }, [activeChatUser, dispatch]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeChatUser || isSending) return;

    await dispatch(
      sendMessage({
        receiverId: activeChatUser.id,
        content: input,
      }),
    ).unwrap();

    setInput("");
  };

  if (!activeChatUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-deep)] text-center p-6">
        <div className="w-20 h-20 bg-[var(--bg-surface)] rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-10 w-10 text-[var(--text-muted)]" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">
          ChatApp Web
        </h2>
        <p className="text-[var(--text-muted)] max-w-md">
          Send and receive messages without keeping your phone online. <br />
          Use ChatApp on up to 4 linked devices and 1 phone at the same time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--bg-deep)] h-full">
      {/* Chat Header */}
      <div className="h-16 bg-[var(--bg-surface)] border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--brand-accent)] flex items-center justify-center text-white font-semibold overflow-hidden border border-white/10">
            {activeChatUser.profilePicture ? (
              <img
                src={activeChatUser.profilePicture}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              activeChatUser.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              {activeChatUser.name}
            </h3>
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-deep)]">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser?.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 shadow-md ${
                  isMe
                    ? "bg-[var(--brand-primary)] text-white rounded-tr-none"
                    : "bg-[var(--bg-card)] text-[var(--text-main)] rounded-tl-none border border-white/5"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
                <p
                  className={`text-[10px] mt-1 text-right ${isMe ? "text-white/70" : "text-[var(--text-muted)]"}`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--bg-surface)] border-t border-white/10">
        <form onSubmit={handleSend} className="flex items-center gap-2">
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 bg-[var(--bg-deep)] text-[var(--text-main)] px-4 py-2.5 rounded-full border border-white/10 focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
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
