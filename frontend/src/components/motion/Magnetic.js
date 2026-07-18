import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";

const SPRING = { stiffness: 350, damping: 18, mass: 0.4 };
const RADIUS = 40; // px of extra hover area around the child

/**
 * Magnetic wrapper for primary CTAs: the child drifts up to `strength` px
 * toward the cursor while it's within ~40px, and springs back on leave.
 * Mouse-only by nature (no touch events), inert under reduced motion.
 *
 *   <Magnetic><Link className="bg-accent ...">Shop</Link></Magnetic>
 */
export default function Magnetic({ children, strength = 8, className = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const handleMove = (e) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const maxX = rect.width / 2 + RADIUS;
    const maxY = rect.height / 2 + RADIUS;
    x.set((Math.max(-maxX, Math.min(maxX, dx)) / maxX) * strength);
    y.set((Math.max(-maxY, Math.min(maxY, dy)) / maxY) * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={reduce ? undefined : { x, y }}
      className={`relative inline-block ${className}`}
    >
      {/* Extends the hover zone RADIUS px beyond the child */}
      <span aria-hidden className="absolute -inset-10" />
      {children}
    </motion.div>
  );
}
