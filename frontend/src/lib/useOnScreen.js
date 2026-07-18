import { useEffect, useRef, useState } from "react";

// Tracks whether an element is near the viewport. Used to pause offscreen
// WebGL canvases (frameloop "never") so they cost nothing while scrolled away.
export function useOnScreen(rootMargin = "200px") {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, visible];
}
