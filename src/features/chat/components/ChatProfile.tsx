import { ArrowLeft, Phone } from "lucide-react";
import type { ChatUser } from "../../../types/chat.types";

type ChatProfileProps = {
  user: ChatUser;
  onBack: () => void;
};

const ChatProfile = ({ user, onBack }: ChatProfileProps) => {
  return (
    <div className="flex flex-col h-full bg-[var(--bg-deep)] animate-fade-in-up">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-xl sticky top-0 z-30 h-[77px]">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">
          User Info
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto custom-scrollbar">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[var(--brand-primary)] blur-2xl opacity-30 rounded-full scale-150"></div>
          <div className="relative h-24 w-24 rounded-full p-1 bg-gradient-to-tr from-[var(--brand-primary)] to-[var(--brand-accent)] shadow-lg">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="h-full w-full rounded-full object-cover border-2 border-[var(--bg-deep)]"
            />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-8">{user.name}</h2>

        <div className="w-full space-y-3">
          <div className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] rounded-xl border border-white/5">
            <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
              <Phone className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Phone
              </p>
              <p className="text-sm text-white truncate">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
