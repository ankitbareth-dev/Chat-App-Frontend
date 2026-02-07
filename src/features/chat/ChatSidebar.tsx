import { MoreHorizontal } from "lucide-react";

const ChatSidebar = () => {
  return (
    <div className="w-full md:w-80 bg-[var(--bg-surface)] border-r border-white/10 flex flex-col h-full">
      <div className="p-4 border-b border-white/10 hidden md:block"></div>

      {/* List Header */}
      <div className="p-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex justify-between items-center">
        <button className="hover:text-white transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;
