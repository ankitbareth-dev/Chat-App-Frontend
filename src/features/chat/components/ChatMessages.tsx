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

  const isLoadingOlderRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isLoadingOlderRef.current) {
      isLoadingOlderRef.current = false;
      return;
    }

    scrollToBottom();
  }, [messages]);

  const handleLoadMoreClick = () => {
    isLoadingOlderRef.current = true;
    onLoadMore();
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto pt-10 pb-2 px-4 md:px-6 flex flex-col-reverse custom-scrollbar [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
      <div className="flex flex-col justify-end min-h-full">
        <div className="h-4 flex-shrink-0" />

        {hasMore && messages.length >= 20 && (
          <div className="flex justify-center py-2 mb-4">
            <button
              onClick={handleLoadMoreClick}
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
          const isSeen = msg.seenAt;

          return (
            <div
              key={msg.id}
              className={`flex w-full ${isMine ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`relative max-w-[280px] md:max-w-md px-3 py-2 rounded-2xl shadow-sm ${
                  isMine
                    ? "bg-[var(--brand-primary)] text-white rounded-br-none"
                    : "bg-[var(--bg-surface)] text-[var(--text-main)] border border-white/5 rounded-bl-none"
                }`}
              >
                <div className="flex items-end gap-2">
                  <p className="text-sm break-words">{msg.content}</p>

                  <div className="flex items-center gap-1 flex-shrink-0 self-end pb-0.5">
                    <span className="text-[9px] opacity-70 tabular-nums">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {isMine &&
                      (isSending ? (
                        <Clock className="h-3 w-3 opacity-70 animate-pulse" />
                      ) : isSeen ? (
                        <DoubleCheck className="h-3 w-3 opacity-100 text-sky-300" />
                      ) : (
                        <Check className="h-3 w-3 opacity-90" />
                      ))}
                  </div>
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

const DoubleCheck = ({ className }: { className?: string }) => (
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
    <path d="M18 6 7 17l-5-5" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
);

export default ChatMessages;
