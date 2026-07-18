import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCart } from "../context/CartContext";
import { useCartUi } from "../context/CartUiContext";

const EASE = [0.22, 1, 0.36, 1];

// Subtotal number-roll: a spring chases the real total and the rendered
// string follows the spring, so changes count up/down instead of jumping.
function RollingPrice({ value }) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 260, damping: 32 });
  const display = useTransform(spring, (v) =>
    `₹${Math.round(v).toLocaleString("en-IN")}`
  );
  useEffect(() => {
    mv.set(value);
  }, [value, mv]);
  return <motion.span>{display}</motion.span>;
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
};

function DrawerItem({ item, updateQuantity, removeFromCart }) {
  return (
    <motion.li
      layout
      variants={itemVariants}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
      className="flex gap-4 border-b border-hairline py-5"
    >
      <img
        src={item.image}
        alt={item.name}
        className="h-24 w-20 flex-shrink-0 border border-hairline object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold leading-snug">{item.name}</p>
            {item.size && (
              <p className="mt-0.5 text-sm text-muted">Size {item.size}</p>
            )}
          </div>
          <button
            onClick={() => removeFromCart(item.cartItemId)}
            aria-label={`Remove ${item.name} from cart`}
            className="text-muted transition-colors hover:text-ink"
          >
            ✕
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center border border-hairline">
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
              className="h-8 w-8 text-sm transition-colors enabled:hover:bg-ink enabled:hover:text-[#0A0A0A] disabled:text-hairline"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              aria-label={`Increase quantity of ${item.name}`}
              className="h-8 w-8 text-sm transition-colors hover:bg-ink hover:text-[#0A0A0A]"
            >
              +
            </button>
          </div>
          <p className="font-semibold">
            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

export default function CartDrawer() {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } =
    useCart();
  const { isCartOpen, closeCart } = useCartUi();
  const panelRef = useRef(null);

  // Portals can't render during SSR — false on the server and during
  // hydration, true on the client afterwards.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Focus trap + Escape + scroll lock while open.
  useEffect(() => {
    if (!isCartOpen) return;
    const previouslyFocused = document.activeElement;
    panelRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        closeCart();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(
        'button:not(:disabled), a[href], input, [tabindex]:not([tabindex="-1"])'
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
  }, [isCartOpen, closeCart]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/70"
          />

          {/* Panel */}
          <motion.aside
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-hairline bg-base outline-none"
          >
            <header className="flex items-center justify-between border-b border-hairline px-6 py-5">
              <h2 className="headline text-2xl">
                Cart{cartCount > 0 ? ` (${cartCount})` : ""}
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="text-xl text-muted transition-colors hover:text-ink"
              >
                ✕
              </button>
            </header>

            {cartItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
                <p className="text-muted">Your cart is empty.</p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="text-sm font-semibold uppercase tracking-widest text-accent-bright hover:text-accent"
                >
                  Shop the drop →
                </Link>
              </div>
            ) : (
              <>
                <motion.ul
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="flex-1 overflow-y-auto px-6"
                >
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <DrawerItem
                        key={item.cartItemId}
                        item={item}
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                      />
                    ))}
                  </AnimatePresence>
                </motion.ul>

                <footer className="border-t border-hairline px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm uppercase tracking-widest text-muted">
                      Subtotal
                    </span>
                    <span className="text-xl font-semibold">
                      <RollingPrice value={cartTotal} />
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Shipping calculated at checkout.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-5 block bg-accent py-4 text-center text-sm font-semibold uppercase tracking-widest text-white transition-colors duration-200 hover:bg-accent-hover"
                  >
                    Checkout
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
