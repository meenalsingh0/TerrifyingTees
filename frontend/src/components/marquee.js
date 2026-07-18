const DEFAULT_TEXT = "FREE SHIPPING OVER ₹999 • NEW DROP EVERY MONTH";

/**
 * Infinite marquee strip — pure CSS. The track holds two identical halves
 * and translates -50%, so the loop point is invisible. Hover pauses.
 * speed = seconds per loop (higher is slower).
 */
export default function Marquee({ text = DEFAULT_TEXT, speed = 24, className = "" }) {
  const half = (
    <span aria-hidden className="flex w-max items-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="whitespace-nowrap px-4">
          {text} •
        </span>
      ))}
    </span>
  );

  return (
    <div
      role="marquee"
      aria-label={text}
      className={`group overflow-hidden bg-accent py-2.5 text-sm font-semibold uppercase tracking-widest text-white ${className}`}
    >
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${speed}s` }}
      >
        {half}
        {half}
      </div>
    </div>
  );
}
