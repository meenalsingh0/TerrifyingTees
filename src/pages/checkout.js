import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAddress } from "../context/AddressContext";



export default function CheckoutPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { addresses, selectedAddress, setSelectedAddress } = useAddress();


    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login?redirect=/checkout");
        }
    }, [isAuthenticated, router]);

    // While redirecting, render nothing
    if (!isAuthenticated) return null;

    return (
        <>
            <Navbar />

            <div className="min-h-screen flex flex-col">
                <div className="flex-1 max-w-4xl mx-auto px-6 py-12">
                    <h1 className="text-3xl font-bold mb-6">Checkout</h1>

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

                        <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
                            Place Order
                        </button>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
