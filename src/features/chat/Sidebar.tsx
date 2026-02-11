import { useEffect, useState } from "react";
import { LogOut, User, UserPlus, Loader2, AlertCircle } from "lucide-react";
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
  };

  return (
    <>
      <aside className="w-80 flex-col border-r border-white/5 bg-[var(--bg-deep)] hidden md:flex h-full">
        <div className="p-4 flex items-center justify-between border-b border-white/5 relative z-20">
          <img
            src="/App-Logo.png"
            alt="App Logo"
            className="h-8 w-auto object-contain"
          />

          <div className="relative ">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 rounded-full p-1 hover:bg-white/5 transition-colors group"
            >
              <div className="h-8 w-8 rounded-full bg-[var(--bg-deep)] flex items-center justify-center border border-white/10 group-hover:border-[var(--brand-primary)] transition-colors cursor-pointer">
                <User className="h-4 w-4 text-[var(--text-muted)]" />
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-deep)] backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-up">
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-3 text-sm text-[var(--text-main)] hover:bg-white/5 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4 text-[var(--text-muted)]" />
                  Profile
                </button>
                <div className="h-px bg-white/5 w-full"></div>

                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chatListLoading && (
            <div className="flex flex-col items-center justify-center py-10 text-[var(--text-muted)]">
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
              <span className="text-xs">Loading chats...</span>
            </div>
          )}

          {chatListError && (
            <div className="p-4 text-center">
              <div className="flex flex-col items-center gap-2 text-red-400 mb-4">
                <AlertCircle className="h-5 w-5" />
                <span className="text-xs">Could not load chats</span>
              </div>
              <button
                onClick={() => dispatch(fetchChatList())}
                className="text-xs text-[var(--brand-primary)] hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {!chatListLoading && !chatListError && chatList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <p className="text-sm text-[var(--text-muted)] mb-2">
                No chats yet.
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Add a friend to start chatting.
              </p>
            </div>
          )}

          {!chatListLoading &&
            chatList.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`w-full flex items-center gap-3 rounded-lg p-3 transition-colors ${
                  activeChatUser?.id === user.id
                    ? "bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20"
                    : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="relative">
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover border border-white/10"
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3
                      className={`text-sm font-medium ${
                        activeChatUser?.id === user.id
                          ? "text-[var(--brand-primary)]"
                          : "text-[var(--text-main)]"
                      }`}
                    >
                      {user.name}
                    </h3>
                  </div>
                  <p className="truncate text-xs text-[var(--text-muted)]">
                    Tap to open chat
                  </p>
                </div>
              </button>
            ))}
        </div>

        <div className="p-4 border-t border-white/5 bg-[var(--bg-deep)]">
          <button
            onClick={handleAddFriendClick}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-white/20 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10 hover:border-[var(--brand-primary)] hover:text-[var(--brand-accent)] transition-all text-sm font-medium group cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Add Friend
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
