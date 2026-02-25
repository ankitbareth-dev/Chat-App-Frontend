import { useEffect, useState, useRef } from "react";
import { MessageCircle, Mic, Send, Loader2 } from "lucide-react";
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
} from "./chatSlice";
import { getSocket } from "../../app/socket";
import type { ChatMessage } from "../../types/chat.types";
import { useHistoryStack } from "../../hooks/useHistoryStack";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import { uploadVoiceNoteApi } from "../../services/chat.service";
import { toast } from "sonner";

// Components
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatProfile from "./components/ChatProfile";

type DisplayMessage = ChatMessage & {
  status?: "sending" | "sent";
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
  const [showProfile, setShowProfile] = useState(false);
  const [isSendingVoice, setIsSendingVoice] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Voice Recorder Hook
  const {
    isRecording,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
    error: recordingError,
  } = useVoiceRecorder();

  const isUserInChatList = activeChatUser
    ? chatList.some((u) => u.id === activeChatUser.id)
    : false;

  // Handle Recording Errors
  useEffect(() => {
    if (recordingError) {
      toast.error(recordingError);
    }
  }, [recordingError]);

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

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stopped_typing", handleUserStoppedTyping);
    };
  }, [activeChatUser, dispatch]);

  useEffect(() => {
    if (activeChatUser && user) {
      const socket = getSocket();
      if (socket) {
        socket.emit("mark_seen", { senderId: activeChatUser.id });
      }
    }
  }, [activeChatUser, user]);

  // --- History Stack Management ---
  const handleProfileClose = () => setShowProfile(false);
  useHistoryStack(showProfile, handleProfileClose, "chat-profile");

  const isChatOpen = !!activeChatUser && !showProfile;
  const handleChatClose = () => dispatch(setActiveChatUser(null));
  useHistoryStack(isChatOpen, handleChatClose, "chat-window");

  const handleBackClick = () => {
    window.history.back();
  };

  // --- Input & Typing Handlers ---
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
        setIsSendingVoice(true);
        try {
          const { url, duration } = await uploadVoiceNoteApi(audioBlob);

          // 1. Optimistic Update
          const tempId = `temp-${Date.now()}`;
          const optimisticMessage: DisplayMessage = {
            id: tempId,
            senderId: user.id,
            receiverId: activeChatUser.id,
            content: url,
            timestamp: new Date().toISOString(),
            status: "sending",
            type: "VOICE",
            duration: duration,
          };
          dispatch(addMessage(optimisticMessage));

          // 2. Socket Emit
          const socket = getSocket();
          if (socket) {
            socket.emit("send_message", {
              receiverId: activeChatUser.id,
              content: url,
              type: "VOICE",
              duration: duration,
            });
          }

          resetRecording();
        } catch (error) {
          console.error(error);
          toast.error("Failed to send voice message");
        } finally {
          setIsSendingVoice(false);
        }
      };

      sendVoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob, isRecording]);

  const handleMicDown = () => {
    if (!isSendingVoice) {
      startRecording();
    }
  };

  const handleMicUp = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  // --- Text Message Handler ---
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChatUser || !user) return;

    const socket = getSocket();
    if (!socket) return;
    const tempId = `temp-${Date.now()}`;
    const messageContent = inputMessage;

    const optimisticMessage: DisplayMessage = {
      id: tempId,
      senderId: user.id,
      receiverId: activeChatUser.id,
      content: messageContent,
      timestamp: new Date().toISOString(),
      status: "sending",
      type: "TEXT",
    };
    dispatch(addMessage(optimisticMessage));

    setInputMessage("");

    socket.emit("send_message", {
      receiverId: activeChatUser.id,
      content: messageContent,
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
          />

          {/* Updated Input Area */}
          <div className="p-4 border-t border-white/5 bg-[var(--bg-deep)] h-[78px] flex items-center flex-shrink-0">
            <div className="flex items-center gap-3 bg-[var(--bg-surface)] rounded-xl p-2 w-full">
              {/* Conditionally Render Input or Recording UI */}
              {isRecording ? (
                <div className="flex-1 flex items-center justify-center gap-2 text-red-400 animate-pulse">
                  <div className="h-3 w-3 bg-red-500 rounded-full" />
                  <span className="text-sm font-mono">
                    {new Date(recordingTime * 1000)
                      .toISOString()
                      .substring(14, 19)}
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isSendingVoice}
                  className="flex-1 bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm outline-none px-3 py-1 disabled:opacity-50"
                />
              )}

              {/* Send or Mic Button */}
              {inputMessage.trim() ? (
                <button
                  onClick={handleSendMessage}
                  className="p-2 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onMouseDown={handleMicDown}
                  onMouseUp={handleMicUp}
                  onMouseLeave={handleMicUp}
                  onTouchStart={handleMicDown}
                  onTouchEnd={handleMicUp}
                  disabled={isSendingVoice}
                  className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white"
                  }`}
                >
                  {isSendingVoice ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default ChatWindow;
