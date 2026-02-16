import { useEffect, useState } from "react";
import {
  LogOut,
  User,
  UserPlus,
  Loader2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchChatList, selectChat, setActiveChatUser } from "./chatSlice";
import ProfileModal from "../profile/ProfileModal";
import LogoutModal from "../auth/LogoutModal";
import AddFriendModal from "../chat/AddFriendModal";
import type { ChatUser } from "../../types/chat.types";

const Sidebar = () => {
  const dispatch = useAppDispatch();

  const { chatList, chatListLoading, chatListError, activeChatUser } =
    useAppSelector(selectChat);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchChatList());
  }, [dispatch]);

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleAddFriendClick = () => {
    setIsAddFriendModalOpen(true);
  };

  const handleSelectUser = (user: ChatUser) => {
    dispatch(setActiveChatUser(user));
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  return (
    <>
      <aside
        className={`
        flex flex-col h-full bg-[var(--bg-deep)] border-r border-white/5 
        transition-transform duration-300 ease-in-out
        w-full md:w-80
        absolute md:relative inset-0 md:inset-auto z-20 md:z-auto
        ${activeChatUser ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center shadow-lg shadow-[var(--brand-primary)]/20">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Chat<span className="text-[var(--brand-primary)]">Flow</span>
            </h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 rounded-full p-1 hover:bg-white/5 transition-colors group"
            >
              <div className="h-9 w-9 rounded-full bg-[var(--bg-surface)] flex items-center justify-center border border-white/10 group-hover:border-[var(--brand-primary)] transition-colors cursor-pointer">
                <User className="h-4 w-4 text-[var(--text-muted)]" />
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--bg-surface)] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
                <div className="p-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-main)] hover:bg-white/5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <User className="h-4 w-4 text-[var(--text-muted)]" />
                    My Profile
                  </button>
                </div>
                <div className="h-px bg-white/5 w-full"></div>
                <div className="p-2">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {chatListLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <Loader2 className="h-8 w-8 animate-spin mb-3 text-[var(--brand-primary)]" />
              <span className="text-sm font-medium">Loading chats...</span>
            </div>
          )}

          {chatListError && (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-3 text-red-400 mb-4 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <AlertCircle className="h-6 w-6" />
                <span className="text-sm font-medium">Connection Error</span>
              </div>
              <button
                onClick={() => dispatch(fetchChatList())}
                className="text-sm text-[var(--brand-primary)] hover:underline font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {!chatListLoading && !chatListError && chatList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 ring-1 ring-white/10">
                <MessageSquare className="h-8 w-8 text-[var(--text-muted)]" />
              </div>
              <p className="text-base font-medium text-white mb-1">
                No Conversations
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Add a friend to start your first chat.
              </p>
            </div>
          )}

          {!chatListLoading &&
            chatList.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-200 group relative overflow-hidden ${
                  activeChatUser?.id === user.id
                    ? "bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 shadow-lg shadow-[var(--brand-primary)]/5"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                {/* Active Indicator Line */}
                {activeChatUser?.id === user.id && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--brand-primary)] rounded-r-full" />
                )}

                <div className="relative">
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover border border-white/10 group-hover:border-[var(--brand-primary)]/50 transition-colors"
                  />
                  {/* Online Dot Simulation */}
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-[var(--bg-deep)]"></div>
                </div>

                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        activeChatUser?.id === user.id
                          ? "text-[var(--brand-primary)]"
                          : "text-[var(--text-main)]"
                      }`}
                    >
                      {user.name}
                    </h3>
                    {/* Placeholder for time */}
                    <span className="text-[10px] text-[var(--text-muted)]">
                      2m
                    </span>
                  </div>
                  <p className="truncate text-xs text-[var(--text-muted)]">
                    Tap to chat
                  </p>
                </div>
              </button>
            ))}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-white/5 bg-[var(--bg-deep)]/50 backdrop-blur-xl">
          <button
            onClick={handleAddFriendClick}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[var(--brand-primary)]/30 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10 hover:border-[var(--brand-primary)] transition-all text-sm font-semibold group cursor-pointer"
          >
            <UserPlus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Add New Friend
          </button>
        </div>
      </aside>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />

      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        onUserSelected={handleSelectUser}
      />
    </>
  );
};

export default Sidebar;
