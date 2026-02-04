import ChatNavbar from "./ChatNavbar";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";

const ChatLayout = () => {
  const { initialLoading } = useAppSelector(selectAuth);

  if (!initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-deep)] overflow-hidden">
      <ChatNavbar />
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar />
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatLayout;
