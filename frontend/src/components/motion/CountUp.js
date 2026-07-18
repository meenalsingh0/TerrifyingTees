import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Number count-up for stats, firing once on scroll into view.
 *
 *   <CountUp to={240} suffix=" gsm" className="headline text-6xl" />
 *   <CountUp to={12000} prefix="₹" />
 */
export default function CountUp({
  to,
  from = 0,
  duration = 1.4,
  prefix = "",
  suffix = "",
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(from);
  const text = useTransform(
    mv,
    (v) => `${prefix}${Math.round(v).toLocaleString("en-IN")}${suffix}`
  );

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(to);
      return;
    }
    const controls = animate(mv, to, { duration, ease: EASE });
    return () => controls.stop();
  }, [inView, reduce, mv, to, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
