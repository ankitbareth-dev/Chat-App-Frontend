export interface ChatUser {
  id: string;
  name: string;
  phone: string;
  profilePicture: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
}
