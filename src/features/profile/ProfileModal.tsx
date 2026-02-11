import { X } from "lucide-react";

const USER_PROFILE = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 012-3456",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
};
type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-[var(--bg-card)] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-8 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Profile Content */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="h-24 w-24 rounded-full p-1 border-2 border-[var(--brand-primary)]/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <img
                src={USER_PROFILE.avatar}
                alt="Profile"
                className="h-full w-full rounded-full object-cover border-4 border-[var(--bg-card)]"
              />
            </div>
          </div>

          {/* Name */}
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-1">
            {USER_PROFILE.name}
          </h2>

          {/* Email & Phone */}
          <div className="w-full mt-6 space-y-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Email
              </span>
              <p className="text-[var(--text-main)] text-sm bg-[var(--bg-deep)]/50 py-2 px-4 rounded-lg w-full border border-white/5">
                {USER_PROFILE.email}
              </p>
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Phone
              </span>
              <p className="text-[var(--text-main)] text-sm bg-[var(--bg-deep)]/50 py-2 px-4 rounded-lg w-full border border-white/5">
                {USER_PROFILE.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
