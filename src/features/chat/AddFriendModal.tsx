import { useState, useEffect } from "react";
import { Search, X, UserPlus, Loader2, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { searchUsers, selectChat, clearSearchResults } from "./chatSlice";
import useDebounce from "../../hooks/useDebounce";
import type { ChatUser } from "../../types/chat.types";

type AddFriendModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUserSelected: (user: ChatUser) => void;
};

const AddFriendModal = ({
  isOpen,
  onClose,
  onUserSelected,
}: AddFriendModalProps) => {
  const dispatch = useAppDispatch();
  const { searchResults, searchLoading, searchError } =
    useAppSelector(selectChat);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 3) {
      dispatch(searchUsers(debouncedQuery));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedQuery, dispatch]);

  const handleClose = () => {
    setSearchQuery("");
    dispatch(clearSearchResults());
    onClose();
  };

  const handleAddUser = (user: ChatUser) => {
    onUserSelected(user);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-[var(--bg-card)] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-[var(--text-main)] mb-1">
            Add Friend
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Search for users by their phone number.
          </p>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Enter phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-[var(--bg-deep)] border border-white/10 py-2.5 pl-9 pr-4 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] transition-colors"
          />
          {searchLoading && (
            <Loader2 className="absolute right-3 top-3 h-4 w-4 text-[var(--brand-primary)] animate-spin" />
          )}
        </div>

        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <p className="text-xs text-[var(--text-muted)] mb-4 px-1">
            Please enter at least 3 digits to search.
          </p>
        )}

        {searchError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="h-4 w-4" />
            {searchError}
          </div>
        )}

        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {searchQuery.length >= 3 ? (
            <>
              {searchLoading && searchResults.length === 0 ? (
                <div className="text-center py-6 text-[var(--text-muted)] text-sm flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-deep)]/30 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-[var(--text-main)]">
                          {user.name}
                        </h4>
                        <p className="text-xs text-[var(--text-muted)]">
                          {user.phone}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddUser(user)}
                      className="p-2 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white shadow-lg transition-transform active:scale-95"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-[var(--text-muted)] text-sm">
                  No users found with that number.
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-lg">
              <Search className="h-8 w-8 text-[var(--text-muted)]/30 mx-auto mb-2" />
              <p className="text-xs text-[var(--text-muted)]">
                Type at least 3 digits to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
