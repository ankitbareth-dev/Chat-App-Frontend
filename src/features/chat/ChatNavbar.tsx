import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, User, ChevronDown, Loader2, X } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser, selectAuth } from "../auth/authSlice";
import {
  searchUsers,
  clearSearchResults,
  selectChat,
  setActiveChat,
} from "../../features/chat/chatSlice";
import { type ChatUser } from "../../types/chat.types";

import useOnClickOutside from "../../hooks/useOnClickOutside";

const ChatNavbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector(selectAuth);
  const {
    searchResults,
    isSearching,
    error: searchError,
  } = useAppSelector(selectChat);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));
  useOnClickOutside(searchRef, () => setIsSearchFocused(false));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.length >= 3) {
        dispatch(searchUsers(searchInput));
      } else {
        dispatch(clearSearchResults());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  const handleLogout = useCallback(async () => {
    setIsDropdownOpen(false);
    await dispatch(logoutUser()).unwrap();
    navigate("/");
  }, [dispatch, navigate]);

  const handleUserClick = useCallback(
    (selectedUser: ChatUser) => {
      console.log("Selected User:", selectedUser);

      dispatch(setActiveChat(selectedUser));

      setSearchInput("");
      dispatch(clearSearchResults());
      setIsSearchFocused(false);
    },
    [dispatch],
  );

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    dispatch(clearSearchResults());
  }, [dispatch]);

  const setSearchFocus = useCallback((focus: boolean) => {
    setIsSearchFocused(focus);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="h-16 bg-[var(--bg-surface)] border-b border-white/10 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[var(--brand-primary)]/20">
          C
        </div>
        <span className="text-xl font-bold text-[var(--text-main)] hidden sm:block">
          ChatApp
        </span>
      </div>

      <div className="flex-1 max-w-md mx-4 relative z-50" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />

          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <input
            type="text"
            placeholder="Search users by phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            className="w-full bg-[var(--bg-deep)] border border-white/10 text-[var(--text-main)] pl-10 pr-8 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] placeholder-gray-500 transition-all"
          />
        </div>
        {(isSearchFocused || searchInput) && (
          <div className="absolute top-full mt-2 w-full bg-[var(--bg-card)] border border-white/10 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden z-50">
            {isSearching && (
              <div className="p-4 flex items-center justify-center text-[var(--text-muted)]">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Searching...
              </div>
            )}
            {!isSearching && searchError && (
              <div className="p-4 text-center text-red-400 text-sm">
                {searchError}
              </div>
            )}

            {!isSearching && !searchError && searchInput.length < 3 && (
              <div className="p-4 text-center text-[var(--text-muted)] text-sm">
                Enter at least 3 digits
              </div>
            )}

            {!isSearching &&
              !searchError &&
              searchInput.length >= 3 &&
              searchResults.length === 0 && (
                <div className="p-4 text-center text-[var(--text-muted)] text-sm">
                  No users found for "{searchInput}"
                </div>
              )}

            {!isSearching && searchResults.length > 0 && (
              <div className="max-h-60 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleUserClick(result)}
                    className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--brand-accent)] flex items-center justify-center text-white font-semibold overflow-hidden border border-white/10 shrink-0">
                      {result.profilePicture ? (
                        <img
                          src={result.profilePicture}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(result.name)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-main)] truncate">
                        {result.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {result.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-lg transition-colors focus:outline-none"
        >
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-[var(--brand-accent)] flex items-center justify-center text-white text-sm font-semibold overflow-hidden border border-white/10">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(user?.name || "User")}</span>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-[var(--text-main)] leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-[var(--text-muted)]">Online</p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </>
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] border border-white/10 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-sm font-medium text-[var(--text-main)]">
                {user?.email}
              </p>
            </div>
            <div className="p-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-main)] hover:bg-white/10 rounded-lg transition-colors text-left">
                <User className="h-4 w-4 text-[var(--text-muted)]" />
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left group"
              >
                <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-300" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ChatNavbar;
