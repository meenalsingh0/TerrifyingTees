import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaUser, FaUserCircle } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useCartUi } from "../context/CartUiContext";
import { useAuth } from "../context/AuthContext";
import MenuOverlay from "./menuOverlay";

/**
 * Site header.
 * - Default: solid (base bg + blur + hairline border), in-flow via spacer.
 * - overlay: fixed transparent over the page's hero, going solid past 80px.
 */
export default function Navbar({ overlay = false }) {
  const { cartCount } = useCart();
  const { openCart } = useCartUi();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const solid = !overlay || scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 text-ink transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid
            ? "border-b border-hairline bg-base/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="group flex h-10 w-8 flex-col justify-center gap-1.5"
            >
              <span className="h-0.5 w-6 bg-ink transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className="h-0.5 w-6 bg-ink transition-transform duration-200 group-hover:-translate-x-0.5" />
            </button>
            <Link href="/" className="font-display text-xl uppercase tracking-tight">
              TerrifyingTees
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={openCart}
              aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              className="relative transition-colors hover:text-accent-bright"
            >
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                // key={cartCount} remounts on every change so the spring pop
                // replays on each add/remove
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
            {isAuthenticated ? (
              <Link href="/profile" aria-label="Profile" className="transition-colors hover:text-accent-bright">
                <FaUserCircle size={22} />
              </Link>
            ) : (
              <Link href="/login" aria-label="Log in" className="transition-colors hover:text-accent-bright">
                <FaUser size={18} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Keeps page content below the fixed header on non-overlay pages */}
      {!overlay && <div className="h-16" aria-hidden />}

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
