import { Send } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../context/SocketContext";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectChat,
  addMessage,
  setTyping,
} from "../../features/chat/chatSlice";

const ChatWindow = () => {
  const socket = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const { activeChatUser, messages, isTyping } = useAppSelector(selectChat);

  const [input, setInput] = useState("");
  const typingTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (message) => {
      dispatch(addMessage(message));
    });

    socket.on("user_typing", ({ senderId }) => {
      if (senderId === activeChatUser?.id) {
        dispatch(setTyping(true));
      }
    });

    socket.on("user_stopped_typing", ({ senderId }) => {
      if (senderId === activeChatUser?.id) {
        dispatch(setTyping(false));
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [socket, activeChatUser, dispatch]);

  if (!activeChatUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted">
        Select a user to start chatting
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    socket.emit("send_message", {
      receiverId: activeChatUser.id,
      content: input,
    });

    setInput("");
    socket.emit("stop_typing", { receiverId: activeChatUser.id });
  };

  const handleTyping = (value: string) => {
    setInput(value);
    if (!socket) return;

    socket.emit("start_typing", { receiverId: activeChatUser.id });

    if (typingTimeout.current) {
      window.clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = window.setTimeout(() => {
      socket.emit("stop_typing", { receiverId: activeChatUser.id });
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-2 rounded-lg ${
              msg.senderId === activeChatUser.id
                ? "bg-gray-700"
                : "bg-blue-600 ml-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {isTyping && (
          <div className="text-xs text-gray-400">
            {activeChatUser.name} is typing...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          className="flex-1 px-4 py-2 rounded-full"
          placeholder="Type a message"
        />
        <button type="submit" className="p-3 rounded-full bg-blue-600">
          <Send />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
