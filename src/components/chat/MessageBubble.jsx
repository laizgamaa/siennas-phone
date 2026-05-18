import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

export default function MessageBubble({ message, isOwn, animate = false }) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 12, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("flex mb-2", isOwn ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-card border border-border text-card-foreground rounded-bl-md"
        )}
      >
        <p>{message.text}</p>
        <div
          className={cn(
            "flex items-center gap-1 mt-1",
            isOwn ? "justify-end" : "justify-start"
          )}
        >
          <span
            className={cn(
              "text-[10px]",
              isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
            )}
          >
            {message.time}
          </span>
          {isOwn && (
            <CheckCheck className="w-3 h-3 text-primary-foreground/60" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
