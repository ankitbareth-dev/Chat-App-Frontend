import { useEffect, useRef } from "react";
import { Loader2, ChevronUp } from "lucide-react";
import TypingIndicator from "../../../components/TypingIndicator";
import type { ChatMessage } from "../../../types/chat.types";

type DisplayMessage = ChatMessage & {
  status?: "sending" | "sent";
};

type ChatMessagesProps = {
  messages: DisplayMessage[];
  currentUserId: string | undefined;
  hasMore: boolean;
  isLoading: boolean;
  isRemoteTyping: boolean;
  onLoadMore: () => void;
};

const ChatMessages = ({
  messages,
  currentUserId,
  hasMore,
  isLoading,
  isRemoteTyping,
  onLoadMore,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col-reverse custom-scrollbar [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
      <div className="flex flex-col justify-end min-h-full">
        {hasMore && messages.length >= 20 && (
          <div className="flex justify-center py-2 mb-4">
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="flex items-center gap-2 text-xs text-[var(--brand-primary)] hover:text-[var(--brand-accent)] bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
              {isLoading ? "Loading..." : "Load Older Messages"}
            </button>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          const isSending = msg.status === "sending";

          return (
            <div
              key={msg.id}
              className={`flex w-full ${isMine ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`relative max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${
                  isMine
                    ? "bg-[var(--brand-primary)] text-white rounded-br-none"
                    : "bg-[var(--bg-surface)] text-[var(--text-main)] border border-white/5 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[10px] opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMine &&
                    (isSending ? (
                      <Clock className="h-3 w-3 opacity-70 animate-pulse" />
                    ) : (
                      <Check className="h-3 w-3 opacity-90" />
                    ))}
                </div>
              </div>
            </div>
          );
        })}

        {isRemoteTyping && (
          <div className="flex justify-start mb-2">
            <TypingIndicator />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

const Check = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default ChatMessages;
