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

  type: "TEXT" | "VOICE" | "IMAGE" | "VIDEO" | "PDF";
  duration?: number;

  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnailUrl?: string;

  sender?: {
    id: string;
    name: string;
    profilePicture: string;
  };
}
