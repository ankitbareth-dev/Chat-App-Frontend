import { useEffect, useState, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuth } from "../auth/authSlice";
import {
  selectChat,
  fetchChatHistory,
  addMessage,
  updateMessageStatus,
  setActiveChatUser,
} from "./chatSlice";
import { getSocket } from "../../app/socket";
import type { ChatMessage } from "../../types/chat.types";

// Components
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import ChatProfile from "./components/ChatProfile";

type DisplayMessage = ChatMessage & {
  status?: "sending" | "sent";
};

const ChatWindow = () => {
  const dispatch = useAppDispatch();
  const {
    activeChatUser,
    messages,
    isLoadingHistory,
    hasMore,
    currentPage,
    chatList,
  } = useAppSelector(selectChat);
  const { user } = useAppSelector(selectAuth);

  const [inputMessage, setInputMessage] = useState("");
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isUserInChatList = activeChatUser
    ? chatList.some((u) => u.id === activeChatUser.id)
    : false;

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

  // Handlers
  const handleBackClick = () => {
    dispatch(setActiveChatUser(null));
  };

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
      {showProfile ? (
        <ChatProfile
          user={activeChatUser}
          onBack={() => setShowProfile(false)}
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

          <ChatInput
            value={inputMessage}
            onChange={handleInputChange}
            onSend={handleSendMessage}
          />
        </>
      )}
    </main>
  );
};

export default ChatWindow;
