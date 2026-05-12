import { useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function ProductCard({ id, name, price, image }) {
  const { addToCart } = useCart();
  const [size, setSize] = useState("");

  const handleAddToCart = () => {
    // 🔒 LOGIC-LEVEL GUARD (most important)
    if (!size) {
      alert("Please choose a size before adding to cart");
      return;
    }

    addToCart({
      id,
      name,
      price,
      image,
      size, // ✅ size ALWAYS present
    });

    setSize(""); // reset after adding
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
      <Link href={`/product/${id}`}>
        <div className="h-56 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <h2 className="font-semibold text-lg">{name}</h2>
        <p className="text-gray-600">₹{price}</p>

        {/* SIZE SELECTOR */}
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="">Choose Size</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>

        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          disabled={!size} // 🔒 UI-LEVEL GUARD
          className={`w-full py-2 rounded transition
            ${
              size
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }
          `}
        >
          {size ? "Add to Cart" : "Select Size"}
        </button>
      </div>
    </div>
  );
}
