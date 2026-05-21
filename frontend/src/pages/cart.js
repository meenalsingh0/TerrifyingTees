import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading } = useCart();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400">Loading your cart...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1 max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
              <Link href="/products">
                <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
                  Shop Now
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center gap-6 p-4 border rounded-lg shadow-sm bg-white"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold truncate">{item.name}</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        ₹{item.price}
                        {item.size && (
                          <> • Size: <b>{item.size}</b></>
                        )}
                      </p>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 border rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-7 h-7 border rounded flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                        >
                          +
                        </button>
                        <span className="ml-2 text-sm text-gray-500">
                          = ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 border rounded-lg shadow bg-white">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="flex justify-between">
                      <span>
                        {item.name} {item.size && `(${item.size})`} × {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-lg font-semibold border-t pt-4">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>

                <Link href="/checkout">
                  <button className="w-full mt-4 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}