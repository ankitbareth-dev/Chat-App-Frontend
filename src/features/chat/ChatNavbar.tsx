import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, User, ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser, selectAuth } from "../auth/authSlice";

const ChatNavbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector(selectAuth);

  // Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search State (Visual and Logic Prep)
  const [searchQuery, setSearchQuery] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await dispatch(logoutUser()).unwrap();
    navigate("/");
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
    <nav className="h-16 bg-[var(--bg-surface)] border-b border-white/10 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
      {/* 1. Left: Logo / Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--brand-primary)] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[var(--brand-primary)]/20">
          C
        </div>
        <span className="text-xl font-bold text-[var(--text-main)] hidden sm:block">
          ChatApp
        </span>
      </div>

      {/* 2. Center: Search Bar */}
      <div className="flex-1 max-w-md mx-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search users by phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[var(--bg-deep)] border border-white/10 text-[var(--text-main)] pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] placeholder-gray-500 transition-all"
        />
      </div>

      {/* 3. Right: User Profile & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-lg transition-colors focus:outline-none"
        >
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
          ) : (
            <>
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[var(--brand-accent)] flex items-center justify-center text-white text-sm font-semibold overflow-hidden border border-white/10">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(user?.name || "User")}</span>
                )}
              </div>

              {/* Name (Hidden on mobile) */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-[var(--text-main)] leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-[var(--text-muted)]">Online</p>
              </div>

              {/* Chevron */}
              <ChevronDown
                className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </>
          )}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] border border-white/10 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden transform origin-top-right transition-all duration-200 z-50">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-sm font-medium text-[var(--text-main)]">
                {user?.email}
              </p>
            </div>

            <div className="p-1">
              <button
                onClick={() => {
                  // Future: Open Profile Modal
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--text-main)] hover:bg-white/10 rounded-lg transition-colors text-left"
              >
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
