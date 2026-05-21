// ─────────────────────────────────────────────────────────────────
// Checkout Page — Uses AddressContext for ID-based address selection
// ─────────────────────────────────────────────────────────────────
//
// Key changes from the old version:
//   • Uses selectedId / setSelectedId instead of array index
//   • selectedAddress is a full address object from the context
//   • shippingAddress string is built from selectedAddress fields
//   • Place Order is disabled when !selectedAddress
//   • Cart items come from useCart() — they already have
//     { productId, quantity, price }, no manual grouping needed
// ─────────────────────────────────────────────────────────────────

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useRouter } from "next/router";
import { useAddress } from "../context/AddressContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { addresses, selectedId, setSelectedId, selectedAddress } = useAddress();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { cartItems, cartTotal, clearCart, loading: cartLoading } = useCart();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError]               = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [isAuthenticated, authLoading, router]);

  // Redirect to cart if empty
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0 && !placingOrder) {
      router.replace("/cart");
    }
  }, [cartItems.length, cartLoading, placingOrder, router]);

  if (authLoading || cartLoading || !isAuthenticated) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  if (cartItems.length === 0) {
    return <div className="p-10 text-center">Your cart is empty...</div>;
  }

  const handlePlaceOrder = async () => {
    // selectedAddress is null when no address is selected or available
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    setError(null);
    setPlacingOrder(true);

    // Build shipping address string from the selected address object
    const shippingAddress = `${selectedAddress.name}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode} (${selectedAddress.phone})`;

    // cartItems already have productId, quantity, price — no manual grouping needed
    const items = cartItems.map((item) => ({
      productId : item.productId,
      quantity  : item.quantity,
      price     : item.price,
    }));

    try {
      await apiFetch("/orders", {
        method : "POST",
        body   : JSON.stringify({ items, shippingAddress }),
      });

      await clearCart();
      router.push("/profile");
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
      setPlacingOrder(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col">
        <div className="flex-1 max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">

            {/* LEFT — Address selection (ID-based, not index-based) */}
            <div className="border rounded-lg p-6 bg-white space-y-3">
              <h2 className="text-xl font-bold mb-3">Delivery Address</h2>

              {addresses.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No saved addresses.{" "}
                  <a href="/profile" className="underline text-black">
                    Add one in your profile →
                  </a>
                </p>
              ) : (
                addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block border p-4 rounded-lg cursor-pointer transition ${
                      selectedId === addr.id
                        ? "border-black bg-gray-50"
                        : "hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedId === addr.id}
                      onChange={() => setSelectedId(addr.id)}
                      className="mr-2"
                    />
                    <span className="font-semibold">{addr.name}</span>
                    {addr.isDefault && (
                      <span className="ml-2 inline-block bg-black text-white text-xs px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {addr.street}, {addr.city}, {addr.state} – {addr.pincode}
                    </p>
                    <p className="text-sm text-gray-500">{addr.phone}</p>
                  </label>
                ))
              )}
            </div>

            {/* RIGHT — Order summary + place order */}
            <div className="border rounded-lg p-6 bg-white space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="space-y-2 text-sm text-gray-600">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between">
                    <span>
                      {item.name}
                      {item.size && ` (${item.size})`}
                      {item.quantity > 1 && ` × ${item.quantity}`}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-4">
                  Payment gateway coming soon — orders are placed as Cash on Delivery.
                </p>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || !selectedAddress}
                  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}