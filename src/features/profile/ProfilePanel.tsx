import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Camera,
  Loader2,
  Check,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuth } from "../auth/authSlice";
import {
  selectProfile,
  updateUserProfile,
  resetProfileState,
} from "../profile/profileSlice";
import { toast } from "sonner";

type ProfilePanelProps = {
  onBack: () => void;
};

const ProfilePanel = ({ onBack }: ProfilePanelProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { loading } = useAppSelector(selectProfile);

  // Local state for form
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      if (user.name !== name) setName(user.name);
      if (user.profilePicture !== previewUrl)
        setPreviewUrl(user.profilePicture);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const result = await dispatch(
      updateUserProfile({
        name,
        file: selectedFile,
      }),
    );

    if (updateUserProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully!");
      setSelectedFile(null);
      dispatch(resetProfileState());
    } else if (updateUserProfile.rejected.match(result)) {
      toast.error(result.payload || "Failed to update profile");
      dispatch(resetProfileState());
    }
  };

  const hasChanges = name !== user?.name || selectedFile !== null;

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-[var(--bg-deep)] relative">
      {/* Minimal Header Area */}
      <div className="relative pt-4 pb-10 px-4 flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={loading}
          className="p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="w-9" />
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col items-center px-6 pb-4 overflow-y-auto custom-scrollbar -mt-12 relative z-10">
        {/* Avatar Section */}
        <div className="relative mb-6 group">
          <div className="relative h-24 w-24 rounded-full p-0.5 bg-white/10">
            <img
              src={previewUrl || user.profilePicture}
              alt="Profile"
              className="h-full w-full rounded-full object-cover border-2 border-[var(--bg-deep)] transition-opacity duration-300"
            />

            <button
              onClick={handleImageClick}
              disabled={loading}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="w-full max-w-sm space-y-1">
          {/* Name Input Row */}
          <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
            <div className="flex-shrink-0 text-[var(--text-muted)] group-hover:text-white transition-colors">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0 border-b border-white/5 pb-4">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1">
                Full Name
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full bg-transparent text-sm text-white outline-none focus:ring-0 placeholder-white/30 disabled:opacity-50"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Email Row (Read Only) */}
          <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors opacity-70">
            <div className="flex-shrink-0 text-[var(--text-muted)]">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0 border-b border-white/5 pb-4">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1">
                Email Address
              </p>
              <p className="text-sm text-white truncate">{user.email}</p>
            </div>
          </div>

          {/* Phone Row (Read Only) */}
          <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors opacity-70">
            <div className="flex-shrink-0 text-[var(--text-muted)]">
              <Phone className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1">
                Phone Number
              </p>
              <p className="text-sm text-white truncate">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 border-t border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-xl">
        <button
          onClick={handleSubmit}
          disabled={!hasChanges || loading || !name.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfilePanel;
