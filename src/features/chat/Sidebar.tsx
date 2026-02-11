import { Search } from "lucide-react";

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
  return (
    <aside className="w-80 flex-col border-r border-white/5 bg-[var(--bg-surface)] hidden md:flex h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-white/5">
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-4">
          Messages
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full rounded-lg bg-[var(--bg-deep)] border border-white/10 py-2 pl-9 pr-4 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] transition-colors"
          />
        </div>
      </div>

      {/* Chat List */}
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
                  className={`text-sm font-medium ${chat.active ? "text-[var(--brand-primary)]" : "text-[var(--text-main)]"}`}
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
    </aside>
  );
};

export default Sidebar;
