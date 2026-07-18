import { useRef } from "react";
import { motion } from "framer-motion";

/**
 * Size chips with radio-group semantics: arrow keys move + select
 * (roving tabindex), Space/Enter select, accent fill when chosen.
 */
export default function SizeSelector({
  sizes = ["S", "M", "L", "XL"],
  value,
  onChange,
  label = "Select size",
  className = "",
}) {
  const refs = useRef([]);
  const selectedIdx = sizes.indexOf(value);

  const handleKeyDown = (e, i) => {
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % sizes.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + sizes.length) % sizes.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = sizes.length - 1;
    if (next !== null) {
      e.preventDefault();
      onChange(sizes[next]);
      refs.current[next]?.focus();
    }
  };

  return (
    <div role="radiogroup" aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {sizes.map((size, i) => {
        const selected = value === size;
        return (
          <motion.button
            key={size}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={selected}
            // Roving tabindex: Tab lands on the selection (or first chip),
            // arrows move within the group.
            tabIndex={selectedIdx === -1 ? (i === 0 ? 0 : -1) : selected ? 0 : -1}
            onClick={() => onChange(size)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 600, damping: 22 }}
            className={`min-w-[3.25rem] border px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              selected
                ? "border-accent bg-accent text-white"
                : "border-hairline bg-transparent text-ink hover:border-ink"
            }`}
          >
            {size}
          </motion.button>
        );
      })}
    </div>
  );
}
