import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../auth/authSlice";

type ProfilePanelProps = {
  onBack: () => void;
};

const ProfilePanel = ({ onBack }: ProfilePanelProps) => {
  const { user } = useAppSelector(selectAuth);

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-[var(--bg-deep)]">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-xl sticky top-0 z-30">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">Profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-4 py-8 overflow-y-auto custom-scrollbar">
        {/* Avatar */}
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

        {/* Name */}
        <h2 className="text-xl font-bold text-white mb-8">{user.name}</h2>

        {/* Info Cards */}
        <div className="w-full space-y-3">
          {/* Name Card */}
          <div className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] rounded-xl border border-white/5">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Full Name
              </p>
              <p className="text-sm text-white truncate">{user.name}</p>
            </div>
          </div>

          {/* Email Card */}
          <div className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] rounded-xl border border-white/5">
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Email Address
              </p>
              <p className="text-sm text-white truncate">{user.email}</p>
            </div>
          </div>

          {/* Phone Card */}
          <div className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] rounded-xl border border-white/5">
            <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
              <Phone className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Phone Number
              </p>
              <p className="text-sm text-white truncate">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
