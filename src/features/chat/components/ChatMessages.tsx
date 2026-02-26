import { useEffect, useRef, useState } from "react";
import { Mic, Download, FileText, Film } from "lucide-react";
import TypingIndicator from "../../../components/TypingIndicator";
import CircularProgress from "../../../components/CircularProgress";
import MediaViewer from "../../../components/MediaViewer";
import type { ChatMessage } from "../../../types/chat.types";
import AudioPlayer from "../../../components/AudioPlayer";
import { downloadFileWithProgress } from "../../../services/chat.service";
import { useAppDispatch } from "../../../app/hooks";
import { updateDownloadProgress } from "../chatSlice";

type DisplayMessage = ChatMessage & {
  status?: "sending" | "sent";
  uploadProgress?: number;
  downloadProgress?: number;
  localUrl?: string;
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
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoadingOlderRef = useRef(false);

  // Media Viewer State
  const [viewerMedia, setViewerMedia] = useState<{
    url: string;
    type: "IMAGE" | "VIDEO" | "PDF";
  } | null>(null);

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

  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Download Handler
  const handleDownload = async (msg: DisplayMessage) => {
    if (!msg.content) return;
    try {
      const blob = await downloadFileWithProgress(msg.content, (progress) => {
        dispatch(updateDownloadProgress({ messageId: msg.id, progress }));
      });

      const localBlobUrl = URL.createObjectURL(blob);
      dispatch(
        updateDownloadProgress({
          messageId: msg.id,
          progress: 100,
          localUrl: localBlobUrl,
        }),
      );
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <>
      {/* GLOBAL MEDIA VIEWER */}
      {viewerMedia && (
        <MediaViewer
          url={viewerMedia.url}
          type={viewerMedia.type}
          onClose={() => setViewerMedia(null)}
        />
      )}

      <div className="flex-1 min-h-0 overflow-y-auto pt-10 pb-2 px-4 md:px-6 flex flex-col-reverse custom-scrollbar">
        <div className="flex flex-col justify-end min-h-full">
          <div className="h-4 flex-shrink-0" />

          {hasMore && messages.length >= 20 && (
            <div className="flex justify-center py-2 mb-4">
              <button
                onClick={handleLoadMoreClick}
                disabled={isLoading}
                className="..."
              >
                {/* ... Load More Button ... */}
                {isLoading ? "Loading..." : "Load Older Messages"}
              </button>
            </div>
          )}

          {messages.map((msg) => {
            const isMine = msg.senderId === currentUserId;
            const isSending = msg.status === "sending";
            const isSeen = msg.seenAt;

            // State Determination
            const isReadyToView = isMine || msg.localUrl || msg.type === "PDF";

            // Display URL Logic
            let displayUrl = msg.content;
            if (isMine && isSending && msg.content.startsWith("blob:")) {
              // Keep local blob for sender
            } else if (msg.localUrl) {
              displayUrl = msg.localUrl;
            }

            // Common Time/Status Component
            const StatusFooter = (
              <div className="flex items-center gap-1 flex-shrink-0 self-end pb-0.5 mt-1">
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
                  } ${msg.type === "VOICE" ? "min-w-[200px] max-w-[320px]" : "max-w-[280px] md:max-w-xs"}`}
                >
                  {/* --- IMAGE --- */}
                  {msg.type === "IMAGE" && (
                    <div className="relative w-64 h-64 bg-black/5 group">
                      {/* Image Layer */}
                      <img
                        src={displayUrl}
                        alt="Image"
                        className="w-full h-full object-cover cursor-pointer"
                        style={{
                          filter: isReadyToView ? "none" : "blur(10px)",
                        }}
                        onClick={() =>
                          isReadyToView &&
                          setViewerMedia({ url: displayUrl, type: "IMAGE" })
                        }
                      />

                      {/* Overlays: Progress or Download */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        {/* Sender: Uploading */}
                        {isMine &&
                          isSending &&
                          msg.uploadProgress !== undefined &&
                          msg.uploadProgress < 100 && (
                            <div className="text-[var(--brand-primary)]">
                              {" "}
                              {/* Uses primary color */}
                              <CircularProgress progress={msg.uploadProgress} />
                            </div>
                          )}

                        {/* Receiver: Needs Download */}
                        {!isMine && !isReadyToView && (
                          <>
                            {msg.downloadProgress &&
                            msg.downloadProgress > 0 &&
                            msg.downloadProgress < 100 ? (
                              <div className="text-[var(--brand-primary)]">
                                <CircularProgress
                                  progress={msg.downloadProgress}
                                />
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDownload(msg)}
                                className="p-3 bg-white/30 rounded-full hover:bg-white/50 backdrop-blur-sm transition"
                              >
                                <Download className="h-6 w-6 text-white" />
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Timestamp Overlay */}
                      <div className="absolute bottom-1.5 right-2 flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {StatusFooter}
                      </div>
                    </div>
                  )}

                  {/* --- VIDEO --- */}
                  {msg.type === "VIDEO" && (
                    <div className="relative w-64 h-48 bg-black/5 group">
                      <img
                        src={msg.thumbnailUrl || displayUrl}
                        alt="Video Thumbnail"
                        className="w-full h-full object-cover"
                        style={{
                          filter: isReadyToView ? "none" : "blur(10px)",
                        }}
                      />

                      {/* Overlays */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        {/* Sender: Uploading */}
                        {isMine &&
                          isSending &&
                          msg.uploadProgress !== undefined &&
                          msg.uploadProgress < 100 && (
                            <div className="text-[var(--brand-primary)]">
                              <CircularProgress progress={msg.uploadProgress} />
                            </div>
                          )}

                        {/* Receiver: Needs Download */}
                        {!isMine && !isReadyToView && (
                          <>
                            {msg.downloadProgress &&
                            msg.downloadProgress > 0 &&
                            msg.downloadProgress < 100 ? (
                              <div className="text-[var(--brand-primary)]">
                                <CircularProgress
                                  progress={msg.downloadProgress}
                                />
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDownload(msg)}
                                className="p-3 bg-white/30 rounded-full backdrop-blur-sm hover:bg-white/50"
                              >
                                <Download className="h-6 w-6 text-white" />
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Play/View Button (only if ready) */}
                      {isReadyToView && !isSending && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={() =>
                              setViewerMedia({ url: displayUrl, type: "VIDEO" })
                            }
                            className="p-3 bg-white/30 rounded-full backdrop-blur-sm hover:bg-white/50 transition"
                          >
                            <Film className="h-6 w-6 text-white" />
                          </button>
                        </div>
                      )}

                      {/* Timestamp Overlay */}
                      <div className="absolute bottom-1.5 right-2 flex items-center gap-1 bg-black/50 px-1.5 py-0.5 rounded">
                        {StatusFooter}
                      </div>
                    </div>
                  )}

                  {/* --- PDF --- */}
                  {msg.type === "PDF" && (
                    <div className="flex flex-col gap-2 p-3 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <FileText className="h-9 w-9 text-red-400 flex-shrink-0" />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium truncate">
                            {msg.fileName || "Document.pdf"}
                          </p>
                          <p className="text-xs opacity-60">
                            {formatBytes(msg.fileSize || 0)}
                          </p>
                        </div>

                        {!isReadyToView ? (
                          <button
                            onClick={() => handleDownload(msg)}
                            className="p-2 hover:bg-white/10 rounded-full"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setViewerMedia({ url: displayUrl, type: "PDF" })
                            }
                            className="p-2 hover:bg-white/10 rounded-full"
                          >
                            <Film className="h-5 w-5" />{" "}
                            {/* Using Film as generic view icon */}
                          </button>
                        )}
                      </div>

                      {/* Progress Line for PDF */}
                      {((isMine && isSending) ||
                        (!isMine &&
                          msg.downloadProgress &&
                          msg.downloadProgress < 100)) && (
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--brand-primary)] transition-all"
                            style={{
                              width: `${(isMine ? msg.uploadProgress : msg.downloadProgress) || 0}%`,
                            }}
                          />
                        </div>
                      )}

                      {StatusFooter}
                    </div>
                  )}

                  {/* --- VOICE --- */}
                  {msg.type === "VOICE" && msg.content && (
                    <div className="flex items-end gap-2 p-1">
                      <AudioPlayer url={msg.content} duration={msg.duration} />
                      {StatusFooter}
                    </div>
                  )}

                  {/* --- TEXT --- */}
                  {msg.type === "TEXT" && (
                    <div className="flex items-end gap-2 px-3 py-2">
                      <p className="text-sm break-words">{msg.content}</p>
                      {StatusFooter}
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
    </>
  );
};

// SVG Components
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
