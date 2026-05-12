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
    const { addresses, selectedAddress, setSelectedAddress } = useAddress();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { cartItems, clearCart } = useCart();
    
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState(null);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace("/login?redirect=/checkout");
        }
    }, [isAuthenticated, authLoading, router]);

    // Redirect to cart if empty
    useEffect(() => {
        if (cartItems.length === 0 && !placingOrder) {
            router.replace("/cart");
        }
    }, [cartItems.length, placingOrder, router]);

    if (authLoading || !isAuthenticated) return <div className="p-10 text-center">Loading...</div>;
    if (cartItems.length === 0) return <div className="p-10 text-center">Your cart is empty...</div>;

    const handlePlaceOrder = async () => {
        if (selectedAddress === null || !addresses[selectedAddress]) {
            setError("Please select a delivery address");
            return;
        }

        setError(null);
        setPlacingOrder(true);

        const address = addresses[selectedAddress];
        const shippingAddress = `${address.name}, ${address.street}, ${address.city}, ${address.state} - ${address.pincode} (${address.phone})`;

        // Group items and map to backend DTO format
        // Backend expects: { productId, quantity, price }
        const itemMap = new Map();
        for (const item of cartItems) {
            if (itemMap.has(item.id)) {
                itemMap.get(item.id).quantity += 1;
            } else {
                itemMap.set(item.id, {
                    productId: item.id,
                    quantity: 1,
                    price: item.price
                });
            }
        }
        const items = Array.from(itemMap.values());

        try {
            await apiFetch("/orders", {
                method: "POST",
                body: JSON.stringify({
                    items,
                    shippingAddress
                })
            });
            
            clearCart();
            // Redirect to profile page to see the new order
            router.push("/profile");
        } catch (err) {
            setError(err.message || "Failed to place order");
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

                    <div className="border rounded-lg p-6 bg-white space-y-4">

                        <h2 className="text-xl font-bold mb-3">Select Delivery Address</h2>

                        {addresses.length === 0 ? (
                            <p className="text-gray-500">No saved addresses. Add one in profile.</p>
                        ) : 
                            addresses.map((addr, i) => (
                                <label key={i} className="block border p-4 rounded mb-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={selectedAddress === i}
                                        onChange={() => setSelectedAddress(i)}
                                        className="mr-2"
                                    />
                                    <span className="font-semibold">{addr.name}</span>
                                    <p className="text-sm">
                                        {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                                    </p>
                                </label>
                            ))
                        }

                        <div className="border-t pt-4">
                            <p className="font-semibold">Payment</p>
                            <p className="text-sm text-gray-500">
                                Payment gateway coming soon...
                            </p>
                        </div>

                        <button 
                            onClick={handlePlaceOrder}
                            disabled={placingOrder}
                            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {placingOrder ? "Placing Order..." : "Place Order"}
                        </button>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
