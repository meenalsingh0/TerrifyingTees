import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
const LINE_STAGGER = 0.08;
const DURATION = 0.6;

/**
 * Masked line-by-line text reveal — the primary heading animation.
 *
 * <RevealText text={"Terrifying\nTees"} className="headline text-7xl" />
 * <RevealText text={["Line one", "Line two"]} trigger="mount" delay={0.2} as="h1" />
 *
 * Props:
 *  - text: string (split on \n) or array of lines
 *  - delay: seconds before the first line starts (default 0)
 *  - className: applied to the outer element (type styles go here)
 *  - trigger: "inview" (default — fires once when scrolled into view;
 *             elements already on screen fire immediately) or "mount"
 *  - as: outer tag for semantics, e.g. "h1", "h2", "p" (default "div")
 *  - flicker: dying-bulb variant — 2–3 rapid opacity stutters before
 *             settling, replacing the slide. Hero/section headlines only.
 */
export default function RevealText({
  text,
  delay = 0,
  className = "",
  trigger = "inview",
  as: Tag = "div",
  flicker = false,
}) {
  const lines = Array.isArray(text) ? text : String(text).split("\n");
  const reduce = useReducedMotion();

  return (
    <Tag className={className}>
      {lines.map((line, i) => {
        const lineDelay = delay + i * LINE_STAGGER;
        const initial = flicker
          ? { opacity: reduce ? 1 : 0 }
          : { y: reduce ? 0 : "110%" };
        const target = flicker
          ? { opacity: reduce ? 1 : [0, 1, 0.15, 1, 0.4, 1] }
          : { y: 0 };
        const transition = flicker
          ? {
              duration: 0.7,
              times: [0, 0.1, 0.18, 0.3, 0.4, 1],
              ease: "linear",
              delay: lineDelay,
            }
          : { duration: DURATION, ease: EASE, delay: lineDelay };
        return (
          <span key={i} className="block overflow-hidden">
            <motion.span
              className="block will-change-transform"
              initial={initial}
              {...(trigger === "mount"
                ? { animate: target }
                : {
                    whileInView: target,
                    viewport: { once: true, amount: 0.4 },
                  })}
              transition={transition}
            >
              {line}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
