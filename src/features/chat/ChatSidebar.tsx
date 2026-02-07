import { useEffect } from "react";
import { MessageSquare, MoreHorizontal } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchChatList,
  setActiveChat,
  selectChat,
} from "../../features/chat/chatSlice";
import type { ChatUser } from "../../types/chat.types";

const ChatSidebar = () => {
  const dispatch = useAppDispatch();
  const { chatList, isLoadingList, activeChatUser } =
    useAppSelector(selectChat);

  useEffect(() => {
    dispatch(fetchChatList());
  }, [dispatch]);

  const handleUserClick = (user: ChatUser) => {
    dispatch(setActiveChat(user));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full md:w-80 bg-[var(--bg-surface)] border-r border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 hidden md:block">
        <h2 className="text-xl font-bold text-[var(--text-main)]">Chats</h2>
      </div>

      {/* Scrollable List Area */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingList ? (
          <div className="flex flex-col items-center justify-center pt-10 space-y-2">
            <div className="w-6 h-6 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[var(--text-muted)]">Loading chats...</p>
          </div>
        ) : chatList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-deep)] flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-main)] mb-1">
              No chats yet
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Search for a user to start a conversation.
            </p>
          </div>
        ) : (
          chatList.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 relative ${
                activeChatUser?.id === user.id
                  ? "bg-white/5 border-l-4 border-l-[var(--brand-primary)]"
                  : "border-l-4 border-l-transparent"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-accent)] flex items-center justify-center text-white font-semibold overflow-hidden border border-white/10">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                {/* Online Indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--bg-surface)] rounded-full" />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-medium text-[var(--text-main)] truncate">
                    {user.name}
                  </h3>
                  <span className="text-xs text-[var(--text-muted)]">Now</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  Click to chat with {user.name}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex justify-end items-center border-t border-white/5">
        <button className="hover:text-white transition-colors p-1 rounded-md">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
