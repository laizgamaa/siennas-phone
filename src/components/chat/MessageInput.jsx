import { useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { cn } from "../../lib/utils";

export default function MessageInput({ enabled, onSend, maxLength }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || !enabled) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 border-t border-border bg-card/80 backdrop-blur-sm">
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border px-4 py-2 transition-colors",
          enabled
            ? "bg-background border-border focus-within:border-primary/50"
            : "bg-muted/50 border-border/50"
        )}
      >
        <button
          disabled={!enabled}
          className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Mensagem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!enabled}
          maxLength={maxLength}
          className={cn(
            "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60",
            !enabled && "cursor-not-allowed opacity-50"
          )}
        />
        <button
          disabled={!enabled}
          className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        >
          <Smile className="w-5 h-5" />
        </button>
        <button
          onClick={handleSend}
          disabled={!enabled || !text.trim()}
          className={cn(
            "p-2 rounded-xl transition-all",
            enabled && text.trim()
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "text-muted-foreground/30"
          )}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
