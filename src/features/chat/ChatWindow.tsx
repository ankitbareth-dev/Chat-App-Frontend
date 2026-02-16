import {
  MessageCircle,
  Phone,
  Video,
  MoreVertical,
  Send,
  Check,
  Clock,
  Loader2,
  ChevronUp,
  AlertCircle,
  ArrowLeft, // 1. Import ArrowLeft
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuth } from "../auth/authSlice";
import {
  selectChat,
  fetchChatHistory,
  addMessage,
  updateMessageStatus,
  setActiveChatUser, // 2. Import setActiveChatUser
} from "./chatSlice";
import { useEffect, useState, useRef } from "react";
import { getSocket } from "../../app/socket";
import TypingIndicator from "../../components/TypingIndicator";
import type { ChatMessage } from "../../types/chat.types";

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

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isUserInChatList = activeChatUser
    ? chatList.some((u) => u.id === activeChatUser.id)
    : false;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 3. Handler to go back (clears active chat, showing Sidebar on mobile)
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

    const optimisticMessage: any = {
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
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3 md:gap-4">
          {/* 4. MOBILE BACK BUTTON - Visible only on small screens */}
          <button
            onClick={handleBackClick}
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <img
            src={activeChatUser.profilePicture}
            alt={activeChatUser.name}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border border-white/10"
          />
          <div>
            <h3 className="font-bold text-base md:text-lg text-[var(--text-main)]">
              {activeChatUser.name}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              {activeChatUser.phone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
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

      {/* Messages Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 flex flex-col-reverse"
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

          {/* Chat History not available if user not in list */}
          {!isUserInChatList && (
            <div className="flex items-center justify-center h-full text-[var(--text-muted)] mb-4">
              <p>No chat history available. Start the conversation!</p>
            </div>
          )}

          {/* Message List */}
          {messages.map((msg) => {
            const isMine = msg.senderId === user?.id;
            // Cast to any to access status if it's not in the type definition
            const isSending = (msg as any).status === "sending";

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
      <div className="p-4 border-t border-white/5 bg-[var(--bg-deep)]">
        <div className="flex items-center gap-3 bg-[var(--bg-surface)] rounded-xl p-2">
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
    </main>
  );
};

export default ChatWindow;
