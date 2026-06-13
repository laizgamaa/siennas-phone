import { useState } from "react";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { contacts, staticMessages } from "../components/chat/chatData";
import { cn } from "../lib/utils";

export default function Chat() {
  const [activeChat, setActiveChat] = useState("kai");
  const [showSidebar, setShowSidebar] = useState(true);

  const activeContact = contacts.find((c) => c.id === activeChat);
  const activeMessages = staticMessages[activeChat] || [];

  const handleSelectChat = (id) => {
    setActiveChat(id);
    setShowSidebar(false);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "h-full transition-all duration-200",
          "md:w-80 md:block md:shrink-0",
          showSidebar ? "w-full block" : "w-0 hidden"
        )}
      >
        <ChatSidebar activeChat={activeChat} onSelectChat={handleSelectChat} />
      </div>

      {/* Chat window */}
      <div
        className={cn(
          "h-full flex-1 bg-background",
          "md:block",
          showSidebar ? "hidden md:block" : "block"
        )}
      >
        {!showSidebar && activeContact ? (
          <ChatWindow
            key={activeContact.id}
            contact={activeContact}
            messages={activeMessages}
            onBack={() => setShowSidebar(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              Escolha uma conversa para começar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
