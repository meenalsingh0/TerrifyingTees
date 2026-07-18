import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Edit labels/routes/teaser images here.
const MENU_LINKS = [
  { label: "Shop", href: "/products", image: "/ichigo black tee.png" },
  { label: "Custom", href: "/custom", image: "/ichigo black tee.png" },
  { label: "About", href: "/about", image: "/ichigo black tee.png" },
  { label: "Contact", href: "/contact", image: "/ichigo black tee.png" },
];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const linkVariants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function MenuOverlay({ open, onClose }) {
  const panelRef = useRef(null);
  const [hovered, setHovered] = useState(0);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Focus trap + Escape + scroll lock (same contract as the cart drawer).
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    panelRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(
        'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      window.__lenis?.start();
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[95] flex bg-base outline-none"
        >
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="absolute right-6 top-5 z-10 text-2xl text-muted transition-colors hover:text-ink"
          >
            ✕
          </button>

          {/* Link list */}
          <motion.nav
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex flex-1 flex-col justify-center gap-2 px-8 md:px-16"
          >
            {MENU_LINKS.map((link, i) => (
              <span key={link.href} className="block overflow-hidden">
                <motion.span variants={linkVariants} className="block">
                  <Link
                    href={link.href}
                    onClick={onClose}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    className="headline block text-6xl text-ink transition-colors duration-200 hover:text-accent md:text-8xl"
                  >
                    {link.label}
                  </Link>
                </motion.span>
              </span>
            ))}
          </motion.nav>

          {/* Product teaser — swaps with the hovered link */}
          <div className="relative hidden w-[38vw] items-center justify-center md:flex">
            <AnimatePresence mode="wait">
              <motion.img
                key={hovered}
                src={MENU_LINKS[hovered].image}
                alt=""
                aria-hidden
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, ease: EASE }}
                className="aspect-[4/5] w-[28vw] border border-hairline object-cover"
              />
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
