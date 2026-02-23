import { ArrowLeft, Phone, Video, User } from "lucide-react";
import type { ChatUser } from "../../../types/chat.types";
import { formatLastSeen } from "../../../utils/formatLastSeen";

type ChatHeaderProps = {
  user: ChatUser;
  onBack: () => void;
  onProfileClick: () => void;
};

const ChatHeader = ({ user, onBack, onProfileClick }: ChatHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-4 border-b border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-md sticky top-0 z-20 h-[69px] flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Back Button */}
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img
          src={user.profilePicture}
          alt={user.name}
          className="h-9 w-9 rounded-full object-cover border border-white/10"
        />

        <div>
          <h3 className="font-bold text-sm md:text-base text-[var(--text-main)]">
            {user.name}
          </h3>
          <p className="text-[10px] md:text-xs text-[var(--text-muted)]">
            {user.isOnline ? (
              <span className="text-green-400">Online</span>
            ) : user.lastSeen ? (
              `Last seen ${formatLastSeen(user.lastSeen)}`
            ) : (
              user.phone
            )}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        <div className="relative group">
          <button className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] transition-colors cursor-not-allowed">
            <Phone className="h-5 w-5" />
          </button>
          <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-[var(--bg-surface)] border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
            Coming Soon
          </div>
        </div>

        <div className="relative group">
          <button className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] transition-colors cursor-not-allowed">
            <Video className="h-5 w-5" />
          </button>
          <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-[var(--bg-surface)] border border-white/10 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
            Coming Soon
          </div>
        </div>

        <button
          onClick={onProfileClick}
          className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
