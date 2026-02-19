import { useEffect, useState, useRef } from "react";
import {
  LogOut,
  User,
  UserPlus,
  Loader2,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchChatList,
  selectChat,
  setActiveChatUser,
  searchUsers,
  clearSearchResults,
} from "./chatSlice";
import LogoutModal from "../auth/LogoutModal";
import ProfilePanel from "../profile/ProfilePanel";
import type { ChatUser } from "../../types/chat.types";
import useDebounce from "../../hooks/useDebounce";
import useOnClickOutside from "../../hooks/useOnClickOutside"; // Import the hook

const Sidebar = () => {
  const dispatch = useAppDispatch();

  const {
    chatList,
    chatListLoading,
    chatListError,
    activeChatUser,
    searchResults,
    searchLoading,
    searchError,
  } = useAppSelector(selectChat);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Ref for the dropdown menu
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hook to close dropdown when clicking outside
  useOnClickOutside(dropdownRef, () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  });

  useEffect(() => {
    dispatch(fetchChatList());
  }, [dispatch]);

  // Handle Search Dispatch
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 3) {
      dispatch(searchUsers(debouncedQuery));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedQuery, dispatch]);

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    setShowProfile(true);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleSelectUser = (user: ChatUser) => {
    dispatch(setActiveChatUser(user));
    setSearchQuery("");
    dispatch(clearSearchResults());
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    dispatch(clearSearchResults());
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
        {showProfile ? (
          <ProfilePanel onBack={() => setShowProfile(false)} />
        ) : (
          <>
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-xl sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-[var(--brand-primary)]/20">
                  <img
                    src="/App-Logo.png"
                    alt="ChatFlow Logo"
                    className="w-[55px] h-[55px] object-contain rounded-md flex-shrink-0"
                  />
                </div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Chat<span className="text-[var(--brand-primary)]">Flow</span>
                </h1>
              </div>

              {/* Attach ref to the container holding the button and menu */}
              <div className="relative" ref={dropdownRef}>
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

            {/* Search Bar */}
            <div className="p-3 border-b border-white/5">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] group-focus-within:text-[var(--brand-primary)] transition-colors" />
                <input
                  type="text"
                  placeholder="Search users by phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--bg-surface)]/50 border border-white/10 rounded-xl py-2.5 pl-9 pr-9 text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {searchLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--brand-primary)] animate-spin" />
                )}
              </div>
            </div>

            {/* Chat List / Search Results Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              {searchQuery.length >= 3 ? (
                <>
                  {searchLoading && searchResults.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-[var(--text-muted)]">
                      <Loader2 className="h-6 w-6 animate-spin mb-2 text-[var(--brand-primary)]" />
                      <span className="text-xs">Searching...</span>
                    </div>
                  )}

                  {searchError && (
                    <div className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2 text-red-400 mb-4 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-xs">{searchError}</span>
                      </div>
                    </div>
                  )}

                  {!searchLoading &&
                    searchResults.length === 0 &&
                    !searchError && (
                      <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-3 ring-1 ring-white/10">
                          <Search className="h-5 w-5 text-[var(--text-muted)]" />
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">
                          No users found.
                        </p>
                      </div>
                    )}

                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="h-12 w-12 rounded-full object-cover border border-white/10"
                          />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-[var(--text-main)]">
                            {user.name}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)]">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                      <div className="p-2 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-all">
                        <UserPlus className="h-4 w-4" />
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {chatListLoading && (
                    <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
                      <Loader2 className="h-8 w-8 animate-spin mb-3 text-[var(--brand-primary)]" />
                      <span className="text-sm font-medium">
                        Loading chats...
                      </span>
                    </div>
                  )}

                  {chatListError && (
                    <div className="p-8 text-center">
                      <div className="flex flex-col items-center gap-3 text-red-400 mb-4 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                        <AlertCircle className="h-6 w-6" />
                        <span className="text-sm font-medium">
                          Connection Error
                        </span>
                      </div>
                      <button
                        onClick={() => dispatch(fetchChatList())}
                        className="text-sm text-[var(--brand-primary)] hover:underline font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {!chatListLoading &&
                    !chatListError &&
                    chatList.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                        <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 ring-1 ring-white/10">
                          <UserPlus className="h-8 w-8 text-[var(--text-muted)]" />
                        </div>
                        <p className="text-base font-medium text-white mb-1">
                          No Conversations
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          Search for a user to start chatting.
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
                        {activeChatUser?.id === user.id && (
                          <div className="absolute left-0 top-2 bottom-2 w-1 bg-[var(--brand-primary)] rounded-r-full" />
                        )}

                        <div className="relative">
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="h-12 w-12 rounded-full object-cover border border-white/10 group-hover:border-[var(--brand-primary)]/50 transition-colors"
                          />
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
                </>
              )}
            </div>
          </>
        )}
      </aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
