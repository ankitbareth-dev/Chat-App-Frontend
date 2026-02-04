import { useEffect } from "react";

import { Loader2, MoreHorizontal } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchChatList,
  searchUsers,
  setActiveChat,
  selectChat,
} from "../../features/chat/chatSlice";

const ChatSidebar = () => {
  const dispatch = useAppDispatch();
  const {
    chatList,
    searchQuery,
    searchResults,
    activeChatUser,
    isLoadingList,
  } = useAppSelector(selectChat);

  // Fetch list on mount
  useEffect(() => {
    dispatch(fetchChatList());
  }, [dispatch]);

  // Handle Search Debounce (Manual implementation for simplicity)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        dispatch(searchUsers(searchQuery));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  const handleUserClick = (user: any) => {
    dispatch(setActiveChat(user));
  };

  const listToDisplay = searchQuery ? searchResults : chatList;

  return (
    <div className="w-full md:w-80 bg-[var(--bg-surface)] border-r border-white/10 flex flex-col h-full">
      {/* Search Header inside Sidebar (Mobile Friendly) */}
      <div className="p-4 border-b border-white/10 hidden md:block">
        {/* Search Input is visually in Navbar, but logic drives this. 
             If mobile, you might want a local search input here */}
      </div>

      {/* List Header */}
      <div className="p-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex justify-between items-center">
        <span>{searchQuery ? "Search Results" : "Chats"}</span>
        <button className="hover:text-white transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingList && listToDisplay.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--text-muted)]" />
          </div>
        ) : listToDisplay.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--text-muted)]">
            {searchQuery
              ? "No users found"
              : "No chats yet. Search a user to start!"}
          </div>
        ) : (
          listToDisplay.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 ${
                activeChatUser?.id === user.id
                  ? "bg-white/10 border-l-4 border-l-[var(--brand-primary)]"
                  : "border-l-4 border-l-transparent"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[var(--brand-accent)] flex items-center justify-center text-white font-semibold overflow-hidden border border-white/10">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--bg-surface)] rounded-full" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold text-[var(--text-main)] truncate">
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
    </div>
  );
};

export default ChatSidebar;
