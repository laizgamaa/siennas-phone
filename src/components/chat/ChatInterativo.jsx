import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ChatInterativo({ contact, onBack }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMessages([]);
  }, [contact.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const buildApiMessages = (msgs) =>
    msgs.map((msg) => ({
      role: msg.sender === "me" ? "user" : "assistant",
      content: msg.text,
    }));

  const handleSend = async (text) => {
    const userMsg = {
      id: Date.now(),
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: contact.id,
          messages: buildApiMessages(updatedMessages),
        }),
      });

      const data = await response.json();

      const replyText = data.content ?? data.error ?? "Erro desconhecido.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: contact.id,
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: contact.id,
          text: "Não foi possível conectar. Tente novamente.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
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
          <h2 className="font-semibold text-sm text-foreground">{contact.name}</h2>
          <p className="text-xs text-muted-foreground">
            {loading ? "escrevendo..." : "Online"}
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

      <div ref={scrollRef} className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender === "me"}
            animate={msg.sender !== "me"}
          />
        ))}
        {loading && <TypingIndicator />}
      </div>

      <MessageInput enabled={!loading} onSend={handleSend} maxLength={300} />
    </div>
  );
}
