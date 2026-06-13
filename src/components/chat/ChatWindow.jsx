import { useEffect, useRef, useState } from "react";
import { kaiIncomingMessage } from "./chatData";
import { kaiDecisionTree } from "./kaiDecisionTree";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import ResponseOptions from "./ResponseOptions";
import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ChatWindow({
  contact,
  messages: initialMessages,
  onBack,
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [showTyping, setShowTyping] = useState(false);
  const [kaiMessageShown, setKaiMessageShown] = useState(false);
  const [currentOptions, setCurrentOptions] = useState(null);
  const scrollRef = useRef(null);

  // Reset messages when contact changes
  useEffect(() => {
    setMessages(initialMessages);
    setKaiMessageShown(false);
    setShowTyping(false);
    setCurrentOptions(null);
  }, [contact.id]);

  // Kai's incoming message animation + show decision tree options after
  useEffect(() => {
    if (contact.id !== "kai" || kaiMessageShown) return;

    const typingTimer = setTimeout(() => setShowTyping(true), 2000);
    const messageTimer = setTimeout(() => {
      setShowTyping(false);
      setMessages((prev) => [...prev, kaiIncomingMessage]);
      setKaiMessageShown(true);
      setCurrentOptions(kaiDecisionTree.options);
    }, 5000);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(messageTimer);
    };
  }, [contact.id, kaiMessageShown]);

  // Auto-scroll on new messages or options
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showTyping, currentOptions]);

  const handleOptionSelect = (option) => {
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: "me",
      text: option.label,
      time: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setCurrentOptions(null);

    // Show typing then Kai's response
    setTimeout(() => setShowTyping(true), 400);
    setTimeout(() => {
      setShowTyping(false);
      const kaiMsg = {
        id: Date.now() + 1,
        sender: "kai",
        text: option.kaiResponse,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, kaiMsg]);

      if (option.options && option.options.length > 0) {
        setCurrentOptions(option.options);
      }
    }, 1800);
  };

  const handleSend = (text) => {
    const newMsg = {
      id: Date.now(),
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="md:hidden p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div
          className={cn(
            "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold text-sm shrink-0",
            contact.color
          )}
        >
          {contact.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm text-foreground">
            {contact.name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {contact.id === "kai" && showTyping
              ? "escrevendo..."
              : contact.status === "online"
              ? "Online"
              : "Visto recentemente"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Video className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4"
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender === "me"}
            animate={msg.id === kaiIncomingMessage.id || msg.sender === "kai"}
          />
        ))}
        {showTyping && <TypingIndicator />}
      </div>

      {/* Response options or free input */}
      {contact.id === "kai" && currentOptions && currentOptions.length > 0 && (
        <ResponseOptions
          options={currentOptions}
          onSelect={handleOptionSelect}
        />
      )}
      <MessageInput enabled={false} onSend={handleSend} />
    </div>
  );
}
