import { useState } from "react";
import { Search, X, UserPlus } from "lucide-react";

type AddFriendModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const DUMMY_USERS = [
  {
    id: 101,
    name: "Charlie Davis",
    phone: "555-0123",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: 102,
    name: "Diana Prince",
    phone: "555-9876",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  },
  {
    id: 103,
    name: "Evan Wright",
    phone: "555-3456",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
];

const AddFriendModal = ({ isOpen, onClose }: AddFriendModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = DUMMY_USERS.filter((user) =>
    user.phone.includes(searchQuery),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-[var(--bg-card)] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
        <button
          onClick={() => {
            onClose();
            setSearchQuery("");
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
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
        </div>

        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <p className="text-xs text-red-400 mb-4 px-1">
            Please enter at least 3 digits to search.
          </p>
        )}

        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {searchQuery.length >= 3 ? (
            filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-deep)]/30 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
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
                  <button className="p-2 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white shadow-lg transition-transform active:scale-95">
                    <UserPlus className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-[var(--text-muted)] text-sm">
                No users found with that number.
              </div>
            )
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
