import { useEffect, useRef } from "react";
import {
  Loader2,
  ChevronUp,
  Mic,
  Download,
  FileText,
  Film,
} from "lucide-react";
import TypingIndicator from "../../../components/TypingIndicator";
import type { ChatMessage } from "../../../types/chat.types";
import AudioPlayer from "../../../components/AudioPlayer";

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
  isRemoteRecording: boolean;
};

const ChatMessages = ({
  messages,
  currentUserId,
  hasMore,
  isLoading,
  isRemoteTyping,
  onLoadMore,
  isRemoteRecording,
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

  // Helper to format file size
  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
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
          const isMedia =
            msg.type === "IMAGE" || msg.type === "VIDEO" || msg.type === "PDF";

          // Common status/time stamp block
          const StatusBlock = (
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
                  <DoubleCheck className="h-3 w-3 opacity-90 text-sky-300" />
                ) : (
                  <Check className="h-3 w-3 opacity-90" />
                ))}
            </div>
          );

          return (
            <div
              key={msg.id}
              className={`flex w-full ${isMine ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`relative rounded-2xl shadow-sm overflow-hidden ${
                  isMine
                    ? "bg-[var(--brand-primary)] text-white rounded-br-none"
                    : "bg-[var(--bg-surface)] text-[var(--text-main)] border border-white/5 rounded-bl-none"
                } ${
                  isMedia
                    ? "min-w-[200px] max-w-[280px] md:max-w-xs"
                    : "max-w-[280px] md:max-w-md"
                } ${
                  // Apply padding only if not Image or Video (those fill the container)
                  msg.type === "IMAGE" || msg.type === "VIDEO"
                    ? "p-0"
                    : "px-3 py-2"
                }`}
              >
                {/* --- IMAGE --- */}
                {msg.type === "IMAGE" && (
                  <div className="relative group bg-black/10">
                    {/* Use thumbnailUrl if available, else content (for optimistic UI) */}
                    <img
                      src={msg.thumbnailUrl || msg.content}
                      alt="Image"
                      className="rounded-xl w-full h-auto max-h-80 object-cover cursor-pointer"
                      onClick={() => {
                        if (!isSending) window.open(msg.content, "_blank");
                      }}
                    />
                    {/* Loading Overlay */}
                    {isSending && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}
                    {/* Time/Status Overlay at bottom */}
                    <div className="absolute bottom-1.5 right-2 flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      <span className="text-[9px] text-white opacity-90 tabular-nums">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMine &&
                        (isSending ? (
                          <Clock className="h-3 w-3 text-white opacity-80 animate-pulse" />
                        ) : isSeen ? (
                          <DoubleCheck className="h-3 w-3 text-sky-300" />
                        ) : (
                          <Check className="h-3 w-3 text-white opacity-90" />
                        ))}
                    </div>
                  </div>
                )}

                {/* --- VIDEO --- */}
                {msg.type === "VIDEO" && (
                  <div className="relative group bg-black/10">
                    <img
                      src={msg.thumbnailUrl || msg.content} // Fallback to content blob for optimistic
                      alt="Video Thumbnail"
                      className="rounded-xl w-full h-auto max-h-80 object-cover opacity-90"
                    />
                    {/* Play Button Overlay */}
                    {!isSending && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => window.open(msg.content, "_blank")}
                          className="p-3 bg-white/30 rounded-full hover:bg-white/50 transition backdrop-blur-sm"
                        >
                          <Film className="h-6 w-6 text-white" />
                        </button>
                      </div>
                    )}
                    {/* Loading Overlay */}
                    {isSending && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}
                    {/* Time/Status Overlay */}
                    <div className="absolute bottom-1.5 right-2 flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      <span className="text-[9px] text-white opacity-90 tabular-nums">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMine &&
                        (isSending ? (
                          <Clock className="h-3 w-3 text-white opacity-80 animate-pulse" />
                        ) : isSeen ? (
                          <DoubleCheck className="h-3 w-3 text-sky-300" />
                        ) : (
                          <Check className="h-3 w-3 text-white opacity-90" />
                        ))}
                    </div>
                  </div>
                )}

                {/* --- PDF --- */}
                {msg.type === "PDF" && (
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <FileText className="h-9 w-9 text-red-400 flex-shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">
                          {msg.fileName || "Document.pdf"}
                        </p>
                        <p className="text-xs opacity-60">
                          {msg.fileSize
                            ? formatBytes(msg.fileSize)
                            : "Unknown size"}
                        </p>
                      </div>
                      {!isSending && (
                        <a
                          href={msg.content}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 hover:bg-white/10 rounded-full transition"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    {/* Footer for PDF */}
                    <div className="flex justify-end items-center gap-1 border-t border-white/5 pt-1 mt-1">
                      {StatusBlock}
                      {isSending && (
                        <Loader2 className="h-3 w-3 animate-spin ml-1" />
                      )}
                    </div>
                  </div>
                )}

                {/* --- VOICE --- */}
                {msg.type === "VOICE" && msg.content && (
                  <div className="flex items-end gap-2">
                    <AudioPlayer url={msg.content} duration={msg.duration} />
                    {StatusBlock}
                  </div>
                )}

                {/* --- TEXT --- */}
                {msg.type === "TEXT" && (
                  <div className="flex items-end gap-2">
                    <p className="text-sm break-words">{msg.content}</p>
                    {StatusBlock}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isRemoteTyping && (
          <div className="flex justify-start mb-2">
            <TypingIndicator />
          </div>
        )}
        {isRemoteRecording && (
          <div className="flex items-center gap-2 p-2 text-red-500">
            <div className="relative flex h-4 w-4 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <Mic className="relative h-3 w-3 text-red-500" />
            </div>
            <span className="text-sm font-medium">Recording voice...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

// SVG Components (Keep as is)
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
