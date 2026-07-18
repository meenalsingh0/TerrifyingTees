import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { NOISE } from "../grainOverlay";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Route transitions (Pages Router): outgoing page dims briefly under a
 * ~300ms burst of jittering TV static, incoming page slides up 20px +
 * fades in as the static clears.
 */
export default function PageTransition({ children }) {
  const router = useRouter();
  // Counts completed navigations so the wipe bar replays per route change
  // but not on initial load.
  const [navCount, setNavCount] = useState(0);

  useEffect(() => {
    const onStart = () => setNavCount((c) => c + 1);
    router.events.on("routeChangeStart", onStart);
    return () => router.events.off("routeChangeStart", onStart);
  }, [router.events]);

  return (
    <>
      {navCount > 0 && (
        // Static burst: snaps on, jitters (CSS tvStatic keyframes), and is
        // gone by the time the incoming page finishes settling.
        <motion.div
          key={navCount}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: 0.3, times: [0, 0.1, 0.7, 1], ease: "linear" }}
          className="pointer-events-none fixed inset-0 z-[110] animate-tv-static bg-base motion-reduce:hidden"
          style={{ backgroundImage: `url("${NOISE}")` }}
        />
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={router.asPath}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.25, ease: EASE },
          }}
          exit={{ opacity: 0.3, transition: { duration: 0.15 } }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
