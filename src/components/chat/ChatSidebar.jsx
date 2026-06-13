import { cn } from "../../lib/utils";
import { contacts, staticMessages } from "./chatData";
import { Search } from "lucide-react";

export default function ChatSidebar({ activeChat, onSelectChat }) {
  const getLastMessage = (contactId) => {
    const msgs = staticMessages[contactId];
    if (!msgs || msgs.length === 0) return "";
    return msgs[msgs.length - 1].text;
  };

  const getLastTime = (contactId) => {
    const msgs = staticMessages[contactId];
    if (!msgs || msgs.length === 0) return "";
    return msgs[msgs.length - 1].time;
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Mensagens
        </h1>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2.5 bg-muted rounded-xl px-3.5 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Procurar"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {contacts.map((contact) => {
          const isActive = activeChat === contact.id;
          const lastMsg = getLastMessage(contact.id);
          const lastTime = getLastTime(contact.id);

          return (
            <button
              key={contact.id}
              onClick={() => onSelectChat(contact.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left",
                isActive
                  ? "bg-primary/8 border-r-2 border-primary"
                  : "hover:bg-muted/60"
              )}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold",
                    contact.color
                  )}
                >
                  {contact.avatar}
                </div>
                {contact.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-card" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={cn(
                      "font-semibold text-sm",
                      isActive ? "text-foreground" : "text-foreground/90"
                    )}
                  >
                    {contact.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                    {lastTime}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {lastMsg}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
