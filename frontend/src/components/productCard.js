import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const EASE = [0.22, 1, 0.36, 1];

export default function ProductCard({
  id,
  name,
  price,
  image,
  hoverImage, // optional on-model shot — crossfades in on hover
  index = 0, // position in the grid, drives the entrance stagger
}) {
  const { addToCart } = useCart();
  const [picking, setPicking] = useState(false);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef(null);

  const handleSize = (size) => {
    addToCart({ id, name, price, image, size });
    setPicking(false);
    setAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1400);
  };

  // Entrance animates transform on this outer node, so the hover lift lives
  // on the inner wrapper — otherwise framer's inline transform wins over CSS.
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE, delay: (index % 4) * 0.05 }}
    >
      <div
        className="group relative transition-transform duration-300 ease-out hover:-translate-y-1"
        onMouseLeave={() => setPicking(false)}
      >
        <div className="relative overflow-hidden border border-hairline bg-surface transition-shadow duration-300 ease-out group-hover:shadow-lift">
          <Link href={`/product/${id}`} className="relative block aspect-[4/5]">
            <img
              src={image}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {hoverImage && (
              // Glitch keyframes run on hover-in (RGB split + displacement,
              // ~150ms of visible glitch); hover-out falls back to the
              // plain opacity transition.
              <img
                src={hoverImage}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 group-hover:animate-glitch motion-reduce:group-hover:animate-none motion-reduce:group-hover:opacity-100"
              />
            )}
          </Link>

          {/* Quick add — slides up from the bottom edge on hover/focus */}
          <div
            className={`absolute inset-x-0 bottom-0 transition-transform duration-300 ease-out group-focus-within:translate-y-0 group-hover:translate-y-0 ${
              picking || added ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {added ? (
              <div className="bg-accent-tint py-3 text-center text-sm font-semibold uppercase tracking-widest text-accent-bright">
                Added ✓
              </div>
            ) : picking ? (
              <div className="flex justify-center gap-1.5 bg-surface/95 px-3 py-2.5 backdrop-blur-sm">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSize(s)}
                    aria-label={`Add ${name} in size ${s}`}
                    className="min-w-[2.5rem] border border-hairline px-2 py-1.5 text-xs font-semibold transition-colors duration-150 hover:border-accent hover:bg-accent hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => setPicking(true)}
                className="w-full bg-ink py-3 text-sm font-semibold uppercase tracking-widest text-[#0A0A0A] transition-colors duration-200 hover:bg-accent hover:text-white"
              >
                Quick add
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-3">
          <Link href={`/product/${id}`} className="min-w-0">
            <h2 className="truncate font-semibold leading-snug">{name}</h2>
          </Link>
          <p className="whitespace-nowrap text-muted">₹{price}</p>
        </div>
      </div>
    </motion.div>
  );
}
