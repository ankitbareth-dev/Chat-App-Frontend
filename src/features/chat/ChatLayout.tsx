import ChatNavbar from "./ChatNavbar";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatLayout = () => {
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
