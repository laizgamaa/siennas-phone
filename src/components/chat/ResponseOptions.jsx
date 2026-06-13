import { motion } from "framer-motion";

export default function ResponseOptions({ options, onSelect }) {
  if (!options || options.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="px-4 py-3 flex flex-col gap-2"
    >
      {/* <p className="text-[11px] text-right text-muted-foreground uppercase tracking-wide font-medium mb-1">
        Responder como…
      </p> */}
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onSelect(opt)}
          className="text-right px-4 py-2.5 rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/15 text-sm text-foreground transition-colors"
        >
          {opt.label}
        </button>
      ))}
    </motion.div>
  );
}
