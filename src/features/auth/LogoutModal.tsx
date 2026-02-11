import { AlertTriangle, X, Loader2 } from "lucide-react";
import { logoutUser, selectAuth } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(selectAuth);

  const handleConfirmLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-[var(--bg-card)] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
        {/* Close Button */}
        {!loading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-bold text-[var(--text-main)] mb-2">
            Log out?
          </h2>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Are you sure you want to end your session? You will need to sign in
            again to access your chats.
          </p>

          {/* Error Display */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg border border-white/10 text-[var(--text-main)] hover:bg-white/5 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLogout}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Yes, Logout"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
