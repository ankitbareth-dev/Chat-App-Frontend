export interface ChatUser {
  id: string;
  name: string;
  phone: string;
  profilePicture: string;
  isOnline?: boolean;
  lastSeen?: string;
  unreadCount?: number;
}
export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  seenAt?: string;
  status?: "sending" | "sent";

  sender?: {
    id: string;
    name: string;
    profilePicture: string;
  };
}
