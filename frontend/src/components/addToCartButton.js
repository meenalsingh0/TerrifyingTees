import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Add-to-cart with success morph: awaits the async onAdd, then swaps the
 * label for a drawn checkmark for ~1.2s before morphing back.
 */
export default function AddToCartButton({ onAdd, disabled, className = "" }) {
  const [status, setStatus] = useState("idle"); // idle | adding | added
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = async () => {
    if (disabled || status !== "idle") return;
    setStatus("adding");
    try {
      await onAdd();
      setStatus("added");
      timer.current = setTimeout(() => setStatus("idle"), 1200);
    } catch (err) {
      console.error("[AddToCartButton] add failed:", err);
      setStatus("idle");
    }
  };

  const label = disabled
    ? "Select a size"
    : status === "adding"
      ? "Adding…"
      : "Add to cart";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-live="polite"
      className={`relative flex h-14 w-full items-center justify-center overflow-hidden text-sm font-semibold uppercase tracking-widest transition-colors duration-200 ${
        disabled
          ? "cursor-not-allowed bg-[#1C1B19] text-muted"
          : status === "added"
            ? "bg-accent text-white"
            : "bg-ink text-[#0A0A0A] hover:bg-accent hover:text-white"
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "added" ? (
          <motion.svg
            key="check"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 24 }}
          >
            <motion.path
              d="M4 12.5l5.5 5.5L20 6.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.05 }}
            />
          </motion.svg>
        ) : (
          <motion.span
            key={label}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
