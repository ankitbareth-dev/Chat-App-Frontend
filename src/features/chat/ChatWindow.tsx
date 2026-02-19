import {
  MessageCircle,
  Phone,
  Video,
  Send,
  Check,
  Clock,
  Loader2,
  ChevronUp,
  AlertCircle,
  ArrowLeft,
  User,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuth } from "../auth/authSlice";
import {
  selectChat,
  fetchChatHistory,
  addMessage,
  updateMessageStatus,
  setActiveChatUser,
} from "./chatSlice";
import { useEffect, useState, useRef } from "react";
import { getSocket } from "../../app/socket";
import TypingIndicator from "../../components/TypingIndicator";
import type { ChatMessage } from "../../types/chat.types";

type DisplayMessage = ChatMessage & {
  status?: "sending" | "sent";
};

const ChatWindow = () => {
  const dispatch = useAppDispatch();
  const {
    activeChatUser,
    messages,
    isLoadingHistory,
    historyError,
    hasMore,
    currentPage,
    chatList,
  } = useAppSelector(selectChat);
  const { user } = useAppSelector(selectAuth);

  const [inputMessage, setInputMessage] = useState("");
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isUserInChatList = activeChatUser
    ? chatList.some((u) => u.id === activeChatUser.id)
    : false;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBackClick = () => {
    dispatch(setActiveChatUser(null));
  };

  useEffect(() => {
    if (activeChatUser && isUserInChatList) {
      dispatch(fetchChatHistory({ receiverId: activeChatUser.id, page: 1 }));
    }
  }, [activeChatUser, dispatch, isUserInChatList]);

  useEffect(() => {
    if (!isLoadingHistory && currentPage === 1) {
      scrollToBottom();
    }
  }, [isLoadingHistory, currentPage]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeChatUser) return;

    const handleReceiveMessage = (newMessage: ChatMessage) => {
      if (newMessage.senderId === activeChatUser.id) {
        dispatch(addMessage(newMessage));
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
    };
    dispatch(addMessage(optimisticMessage));

    setInputMessage("");
    scrollToBottom();

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
      {/* --- Profile View (Conditionally Rendered) --- */}
      {showProfile ? (
        <div className="flex flex-col h-full bg-[var(--bg-deep)] animate-fade-in-up">
          {/* Profile Header */}
          <div className="p-4 flex items-center gap-3 border-b border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-xl sticky top-0 z-30 h-[77px]">
            <button
              onClick={() => setShowProfile(false)}
              className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-white tracking-tight">
              User Info
            </h1>
          </div>

          {/* Profile Content */}
          <div className="flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto custom-scrollbar">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[var(--brand-primary)] blur-2xl opacity-30 rounded-full scale-150"></div>
              <div className="relative h-24 w-24 rounded-full p-1 bg-gradient-to-tr from-[var(--brand-primary)] to-[var(--brand-accent)] shadow-lg">
                <img
                  src={activeChatUser.profilePicture}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover border-2 border-[var(--bg-deep)]"
                />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-8">
              {activeChatUser.name}
            </h2>

            <div className="w-full space-y-3">
              <div className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] rounded-xl border border-white/5">
                <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                    Phone
                  </p>
                  <p className="text-sm text-white truncate">
                    {activeChatUser.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // --- Chat View (Default) ---
        <>
          {/* Header */}
          <header className="flex items-center justify-between px-4 py-4 border-b border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-md sticky top-0 z-10 h-[77px]">
            <div className="flex items-center gap-3">
              {/* Mobile Back Button */}
              <button
                onClick={handleBackClick}
                className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <img
                src={activeChatUser.profilePicture}
                alt={activeChatUser.name}
                className="h-9 w-9 rounded-full object-cover border border-white/10"
              />
              <div>
                <h3 className="font-bold text-sm md:text-base text-[var(--text-main)]">
                  {activeChatUser.name}
                </h3>
                <p className="text-[10px] md:text-xs text-[var(--text-muted)]">
                  {activeChatUser.phone}
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Phone Button with Tooltip */}
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] transition-colors cursor-not-allowed">
                  <Phone className="h-5 w-5" />
                </button>
                <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-[var(--bg-surface)] border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                  Coming Soon
                </div>
              </div>

              {/* Video Button with Tooltip */}
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] transition-colors cursor-not-allowed">
                  <Video className="h-5 w-5" />
                </button>
                <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-[var(--bg-surface)] border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                  Coming Soon
                </div>
              </div>

              {/* User Profile Button */}
              <button
                onClick={() => setShowProfile(true)}
                className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Messages Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col-reverse custom-scrollbar
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-white/10
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
          >
            <div className="flex flex-col justify-end min-h-full">
              {/* Load More Button */}
              {hasMore && isUserInChatList && (
                <div className="flex justify-center py-2 mb-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingHistory}
                    className="flex items-center gap-2 text-xs text-[var(--brand-primary)] hover:text-[var(--brand-accent)] bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                  >
                    {isLoadingHistory ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                    {isLoadingHistory ? "Loading..." : "Load Older Messages"}
                  </button>
                </div>
              )}

              {historyError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                  <AlertCircle className="h-4 w-4" /> {historyError}
                </div>
              )}

              {!isUserInChatList && (
                <div className="flex items-center justify-center h-full text-[var(--text-muted)] mb-4">
                  <p>No chat history available. Start the conversation!</p>
                </div>
              )}

              {/* Message List */}
              {messages.map((msg) => {
                const isMine = msg.senderId === user?.id;
                const isSending = (msg as DisplayMessage).status === "sending";

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

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-[var(--bg-deep)] h-[78px] flex items-center">
            <div className="flex items-center gap-3 bg-[var(--bg-surface)] rounded-xl p-2 w-full">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] text-sm outline-none px-3 py-1"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-lg bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white transition-colors disabled:opacity-50"
                disabled={!inputMessage.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default ChatWindow;
