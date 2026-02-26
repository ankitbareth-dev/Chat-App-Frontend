import { useEffect, useState, useRef } from "react";
import {
  MessageCircle,
  Mic,
  Send,
  Pause,
  Square,
  X,
  Play,
  Paperclip,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuth } from "../auth/authSlice";
import {
  selectChat,
  fetchChatHistory,
  addMessage,
  updateMessageStatus,
  setActiveChatUser,
  selectActiveChatMessages,
  selectActiveChatPagination,
  updateOptimisticUrl,
  updateUploadProgress,
} from "./chatSlice";
import { getSocket } from "../../app/socket";
import type { ChatMessage } from "../../types/chat.types";
import { useHistoryStack } from "../../hooks/useHistoryStack";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import {
  uploadMediaWithProgress,
  uploadVoiceNoteApi,
} from "../../services/chat.service";
import { toast } from "sonner";

// Components
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatProfile from "./components/ChatProfile";

type DisplayMessage = ChatMessage & {
  status?: "sending" | "sent";
  uploadProgress?: number;
  thumbnailUrl?: string;
  localUrl?: string;
};

const ChatWindow = () => {
  const dispatch = useAppDispatch();
  const { activeChatUser, isLoadingHistory, chatList } =
    useAppSelector(selectChat);
  const messages = useAppSelector(selectActiveChatMessages);
  const { currentPage, hasMore } = useAppSelector(selectActiveChatPagination);
  const { user } = useAppSelector(selectAuth);

  const [inputMessage, setInputMessage] = useState("");
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);
  const [isRemoteRecording, setIsRemoteRecording] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Recorder Hook
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    error: recordingError,
  } = useVoiceRecorder();

  const isUserInChatList = activeChatUser
    ? chatList.some((u) => u.id === activeChatUser.id)
    : false;

  useEffect(() => {
    if (recordingError) toast.error(recordingError);
  }, [recordingError]);

  // Fetch History
  useEffect(() => {
    if (activeChatUser && isUserInChatList) {
      dispatch(fetchChatHistory({ receiverId: activeChatUser.id, page: 1 }));
    }
  }, [activeChatUser, dispatch, isUserInChatList]);

  // Socket Listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeChatUser) return;

    const handleReceiveMessage = (newMessage: ChatMessage) => {
      if (newMessage.senderId === activeChatUser.id) {
        dispatch(addMessage(newMessage));
        socket.emit("mark_seen", { senderId: activeChatUser.id });
      }
    };

    const handleMessageSent = (confirmedMessage: ChatMessage) => {
      dispatch(
        updateMessageStatus({
          content: confirmedMessage.content,
          senderId: confirmedMessage.senderId,
          confirmedMessage: confirmedMessage,
        }),
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);

    const handleUserTyping = (data: { senderId: string }) => {
      if (data.senderId === activeChatUser.id) setIsRemoteTyping(true);
    };
    const handleUserStoppedTyping = (data: { senderId: string }) => {
      if (data.senderId === activeChatUser.id) setIsRemoteTyping(false);
    };
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stopped_typing", handleUserStoppedTyping);

    const handleUserRecording = (data: { senderId: string }) => {
      if (data.senderId === activeChatUser.id) {
        setIsRemoteRecording(true);
        setIsRemoteTyping(false);
      }
    };

    const handleUserStoppedRecording = (data: { senderId: string }) => {
      if (data.senderId === activeChatUser.id) {
        setIsRemoteRecording(false);
      }
    };

    socket.on("user_recording", handleUserRecording);
    socket.on("user_stopped_recording", handleUserStoppedRecording);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stopped_typing", handleUserStoppedTyping);
      socket.off("user_recording", handleUserRecording);
      socket.off("user_stopped_recording", handleUserStoppedRecording);
    };
  }, [activeChatUser, dispatch]);

  useEffect(() => {
    if (activeChatUser && user) {
      const socket = getSocket();
      if (socket) socket.emit("mark_seen", { senderId: activeChatUser.id });
    }
  }, [activeChatUser, user]);

  // History Stack
  const handleProfileClose = () => setShowProfile(false);
  useHistoryStack(showProfile, handleProfileClose, "chat-profile");
  const isChatOpen = !!activeChatUser && !showProfile;
  const handleChatClose = () => dispatch(setActiveChatUser(null));
  useHistoryStack(isChatOpen, handleChatClose, "chat-window");
  const handleBackClick = () => window.history.back();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChatUser || !user) return;

    const tempId = `temp-${Date.now()}`;
    const localUrl = URL.createObjectURL(file);

    let type: "IMAGE" | "VIDEO" | "PDF" = "IMAGE";
    if (file.type.startsWith("video")) type = "VIDEO";
    else if (file.type === "application/pdf") type = "PDF";

    // 1. Optimistic Update
    const optimisticMessage: DisplayMessage = {
      id: tempId,
      senderId: user.id,
      receiverId: activeChatUser.id,
      content: localUrl,
      timestamp: new Date().toISOString(),
      status: "sending",
      type: type,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadProgress: 0,
    };

    dispatch(addMessage(optimisticMessage));
    setInputMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    // 2. Upload Logic
    const sendMedia = async () => {
      try {
        const mediaData = await uploadMediaWithProgress(file, (progress) => {
          dispatch(updateUploadProgress({ tempId, progress }));
        });

        dispatch(
          updateOptimisticUrl({
            tempId,
            url: mediaData.url,
            thumbnailUrl: mediaData.thumbnailUrl,
            fileName: mediaData.fileName,
            fileSize: mediaData.fileSize,
            mimeType: mediaData.mimeType,
            duration: mediaData.duration,
          }),
        );

        const socket = getSocket();
        if (socket) {
          socket.emit("send_message", {
            receiverId: activeChatUser.id,
            content: mediaData.url,
            type: type,
            fileName: mediaData.fileName,
            fileSize: mediaData.fileSize,
            mimeType: mediaData.mimeType,
            thumbnailUrl: mediaData.thumbnailUrl,
            duration: mediaData.duration,
          });
        }

        // Revoke local URL after upload to free memory
        URL.revokeObjectURL(localUrl);
      } catch (error) {
        console.error(error);
        toast.error("Failed to send media");
      }
    };

    sendMedia();
  };

  // Input Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    const socket = getSocket();
    if (!socket || !activeChatUser) return;

    socket.emit("start_typing", { receiverId: activeChatUser.id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { receiverId: activeChatUser.id });
    }, 2000);
  };

  useEffect(() => {
    if (audioBlob && !isRecording && activeChatUser && user) {
      const sendVoice = async () => {
        const localUrl = URL.createObjectURL(audioBlob);
        const tempId = `temp-${Date.now()}`;

        const optimisticMessage: DisplayMessage = {
          id: tempId,
          senderId: user.id,
          receiverId: activeChatUser.id,
          content: localUrl,
          timestamp: new Date().toISOString(),
          status: "sending",
          type: "VOICE",
          duration: recordingTime,
        };
        dispatch(addMessage(optimisticMessage));
        resetRecording();

        try {
          const { url, duration } = await uploadVoiceNoteApi(audioBlob);

          dispatch(updateOptimisticUrl({ tempId, url }));

          const socket = getSocket();
          if (socket) {
            socket.emit("send_message", {
              receiverId: activeChatUser.id,
              content: url,
              type: "VOICE",
              duration: duration,
            });
          }

          URL.revokeObjectURL(localUrl);
        } catch (error) {
          console.error(error);
          toast.error("Failed to send voice message");
        }
      };
      sendVoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob, isRecording]);

  // Text Send Logic
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChatUser || !user) return;
    const socket = getSocket();
    if (!socket) return;
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: DisplayMessage = {
      id: tempId,
      senderId: user.id,
      receiverId: activeChatUser.id,
      content: inputMessage,
      timestamp: new Date().toISOString(),
      status: "sending",
      type: "TEXT",
    };
    dispatch(addMessage(optimisticMessage));
    setInputMessage("");
    socket.emit("send_message", {
      receiverId: activeChatUser.id,
      content: inputMessage,
    });
    socket.emit("stop_typing", { receiverId: activeChatUser.id });
  };

  const handleLoadMore = () => {
    if (isLoadingHistory || !hasMore || !activeChatUser) return;
    dispatch(
      fetchChatHistory({
        receiverId: activeChatUser.id,
        page: currentPage + 1,
      }),
    );
  };

  // Helper for time formatting
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!activeChatUser) {
    return (
      <main className="flex-1 h-full bg-[var(--bg-deep)] hidden md:flex md:flex-col items-center justify-center p-6 text-center relative overflow-hidden">
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
      {showProfile ? (
        <ChatProfile
          user={activeChatUser}
          onBack={() => window.history.back()}
        />
      ) : (
        <>
          <ChatHeader
            user={activeChatUser}
            onBack={handleBackClick}
            onProfileClick={() => setShowProfile(true)}
          />
          <ChatMessages
            messages={messages as DisplayMessage[]}
            currentUserId={user?.id}
            hasMore={hasMore}
            isLoading={isLoadingHistory}
            isRemoteTyping={isRemoteTyping}
            onLoadMore={handleLoadMore}
            isRemoteRecording={isRemoteRecording}
          />

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-[var(--bg-deep)] min-h-[78px] flex items-center flex-shrink-0">
            <div className="flex items-center gap-3 w-full">
              {/* Conditionally Render Input or Recording Info */}
              {isRecording ? (
                <div className="flex-1 flex items-center justify-between bg-[var(--bg-surface)] rounded-xl p-2 px-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-mono font-bold">
                      {formatTime(recordingTime)}
                    </span>
                    {isPaused && (
                      <span className="text-xs opacity-70 ml-1">(Paused)</span>
                    )}
                  </div>

                  {/* Recording Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const socket = getSocket();
                        if (socket)
                          socket.emit("stop_recording", {
                            receiverId: activeChatUser.id,
                          });
                        resetRecording();
                      }}
                      className="p-2 rounded-full hover:bg-white/10 text-[var(--text-muted)]"
                    >
                      <X className="h-5 w-5" />
                    </button>

                    {isPaused ? (
                      <button
                        onClick={resumeRecording}
                        className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Play className="h-5 w-5 fill-white" />
                      </button>
                    ) : (
                      <button
                        onClick={pauseRecording}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Pause className="h-5 w-5" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const socket = getSocket();
                        if (socket)
                          socket.emit("stop_recording", {
                            receiverId: activeChatUser.id,
                          });
                        stopRecording();
                      }}
                      className="p-2 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white"
                    >
                      <Square className="h-5 w-5 fill-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*,application/pdf"
                  />

                  {/* Default Input Field */}
                  <div className="flex-1 bg-[var(--bg-surface)] rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={inputMessage}
                      onChange={handleInputChange}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1 bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm outline-none"
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      if (inputMessage.trim()) {
                        handleSendMessage();
                      } else {
                        const socket = getSocket();
                        if (socket && activeChatUser) {
                          socket.emit("start_recording", {
                            receiverId: activeChatUser.id,
                          });
                        }
                        startRecording();
                      }
                    }}
                    className="p-3 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white transition-colors flex items-center justify-center"
                  >
                    {inputMessage.trim() ? (
                      <Send className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default ChatWindow;
