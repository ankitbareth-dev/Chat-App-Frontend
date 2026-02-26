import { useState } from "react";
import { ArrowLeft, Phone } from "lucide-react";
import type { ChatUser } from "../../../types/chat.types";
import ImagePreviewModal from "../../../components/ImagePreviewModal";

type ChatProfileProps = {
  user: ChatUser;
  onBack: () => void;
};

const ChatProfile = ({ user, onBack }: ChatProfileProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-col h-full bg-[var(--bg-deep)] animate-fade-in-up relative">
        {/* Header */}
        <div className="h-[70px] p-4 flex items-center gap-3 border-b border-white/5 bg-[var(--bg-deep)]/80 backdrop-blur-xl sticky top-0 z-30 flex-shrink-0">
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
        <div className="flex-1 flex flex-col items-center px-6 py-8 overflow-y-auto custom-scrollbar">
          {/* Avatar */}
          <div className="relative mb-6 group">
            <div className="h-24 w-24 rounded-full p-0.5 bg-white/10">
              <img
                src={user.profilePicture}
                alt="Profile"
                onClick={() => setPreviewImage(user.profilePicture)}
                className="h-full w-full rounded-full object-cover border-2 border-[var(--bg-deep)] transition-opacity duration-300 cursor-pointer hover:opacity-90"
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-8">{user.name}</h2>

          <div className="w-full max-w-sm space-y-1">
            {/* Phone Row */}
            <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors">
              <div className="flex-shrink-0 text-[var(--text-muted)] group-hover:text-white transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0 border-b border-white/5 pb-4">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-medium mb-1">
                  Phone
                </p>
                <p className="text-sm text-white truncate">{user.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage || ""}
        userName={user.name}
      />
    </>
  );
};

export default ChatProfile;
