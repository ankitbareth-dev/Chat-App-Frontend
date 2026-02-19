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
    <div className="flex flex-col h-full bg-[var(--bg-deep)] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[var(--brand-primary)]/10 to-transparent pointer-events-none" />

      {/* Header / Cover Area */}
      <div className="relative h-32 bg-gradient-to-br from-[var(--brand-primary)] via-purple-600/50 to-[var(--brand-accent)]/30 overflow-hidden">
        {/* Back Button - Floating on top of cover */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col items-center px-4 pb-6 overflow-y-auto custom-scrollbar -mt-16 relative z-10">
        {/* Avatar Section */}
        <div className="relative mb-4 animate-fade-in-up">
          {/* Outer Ring Glow */}
          <div className="absolute inset-0 bg-[var(--brand-accent)] blur-2xl opacity-40 rounded-full scale-90"></div>

          {/* Avatar Container */}
          <div className="relative h-28 w-28 rounded-full p-1.5 bg-gradient-to-tr from-[var(--brand-primary)] to-[var(--brand-accent)] shadow-2xl shadow-[var(--brand-primary)]/20">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="h-full w-full rounded-full object-cover border-4 border-[var(--bg-deep)]"
            />
          </div>
        </div>

        {/* Name & Role */}
        <div
          className="text-center mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {user.name}
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            Active Now
          </p>
        </div>

        {/* Info Cards Container */}
        <div className="w-full space-y-3 max-w-xs">
          {/* Name Card */}
          <div
            className="group flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-surface)]/50 border border-white/5 backdrop-blur-lg hover:bg-[var(--bg-surface)]/80 hover:border-white/10 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <User className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">
                Full Name
              </p>
              <p className="text-sm text-white font-medium truncate">
                {user.name}
              </p>
            </div>
          </div>

          {/* Email Card */}
          <div
            className="group flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-surface)]/50 border border-white/5 backdrop-blur-lg hover:bg-[var(--bg-surface)]/80 hover:border-white/10 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center border border-purple-500/20 shadow-lg shadow-purple-500/5">
              <Mail className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">
                Email Address
              </p>
              <p className="text-sm text-white font-medium truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Phone Card */}
          <div
            className="group flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-surface)]/50 border border-white/5 backdrop-blur-lg hover:bg-[var(--bg-surface)]/80 hover:border-white/10 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center border border-green-500/20 shadow-lg shadow-green-500/5">
              <Phone className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">
                Phone Number
              </p>
              <p className="text-sm text-white font-medium truncate">
                {user.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
