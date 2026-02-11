import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";

const ChatLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-deep)] font-sans">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatLayout;
