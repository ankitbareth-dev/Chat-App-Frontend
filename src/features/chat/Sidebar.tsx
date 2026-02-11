import { useState } from "react";
import { LogOut, User, UserPlus } from "lucide-react";
import ProfileModal from "../profile/ProfileModal";
import LogoutModal from "../auth/LogoutModal";

const DUMMY_CHATS = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    lastMessage: "Hey! Are we still on for the meeting?",
    time: "10:42 AM",
    unread: 2,
    active: true,
  },
  {
    id: 2,
    name: "Dev Team",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    lastMessage: "Deployed the new update.",
    time: "09:15 AM",
    unread: 0,
    active: false,
  },
  {
    id: 3,
    name: "Sarah Connor",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    lastMessage: "The future is not set.",
    time: "Yesterday",
    unread: 0,
    active: false,
  },
];

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // New state

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  return (
    <>
      <aside className="w-80 flex-col border-r border-white/5 bg-[var(--bg-surface)] hidden md:flex h-full">
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
              <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-card)] backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-up">
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-4 py-3 text-sm text-[var(--text-main)] hover:bg-white/5 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4 text-[var(--text-muted)]" />
                  Profile
                </button>
                <div className="h-px bg-white/5 w-full"></div>

                {/* Updated Logout Button */}
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
          {DUMMY_CHATS.map((chat) => (
            <button
              key={chat.id}
              className={`w-full flex items-center gap-3 rounded-lg p-3 transition-colors ${
                chat.active
                  ? "bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="h-10 w-10 rounded-full object-cover border border-white/10"
                />
                {chat.unread > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--brand-primary)] text-[10px] text-white">
                    {chat.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-0.5">
                  <h3
                    className={`text-sm font-medium ${
                      chat.active
                        ? "text-[var(--brand-primary)]"
                        : "text-[var(--text-main)]"
                    }`}
                  >
                    {chat.name}
                  </h3>
                  <span className="text-xs text-[var(--text-muted)]">
                    {chat.time}
                  </span>
                </div>
                <p className="truncate text-xs text-[var(--text-muted)]">
                  {chat.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 bg-[var(--bg-surface)]">
          <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-white/20 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10 hover:border-[var(--brand-primary)] hover:text-[var(--brand-accent)] transition-all text-sm font-medium group cursor-pointer">
            <UserPlus className="h-4 w-4" />
            Add Friend
          </button>
        </div>
      </aside>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
