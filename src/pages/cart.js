import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useCart } from "../context/CartContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Link from "next/link";



export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);

  return (

    <>
      <Navbar />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1 max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-6 p-4 border rounded-lg shadow-sm bg-white"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />

                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-gray-600">
                        ₹{item.price} • Size: <b>{item.size}</b>
                      </p>

                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 border rounded-lg shadow bg-white">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="flex justify-between text-lg mb-4">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <Link href="/checkout">
                  <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800">
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
