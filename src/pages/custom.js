import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function CustomOrderPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Later: send to backend / email / WhatsApp
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Custom T-Shirt Orders</h1>

        <p className="text-gray-600 mb-8">
          Have an idea in mind? Want a custom design, anime art, logo, or quote
          printed on premium tees?  
          Tell us your requirements and we’ll get back to you.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-lg shadow"
          >
            {/* Name */}
            <input
              type="text"
              required
              placeholder="Your Name"
              className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-black outline-none"
            />

            {/* Email */}
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-black outline-none"
            />

            {/* Phone */}
            <input
              type="text"
              placeholder="Phone / WhatsApp (optional)"
              className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-black outline-none"
            />

            {/* Product Type */}
            <select
              required
              className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-black outline-none"
            >
              <option value="">Select Product Type</option>
              <option>Oversized T-Shirt</option>
              <option>Regular Fit T-Shirt</option>
            </select>

            {/* Size */}
            <select
              required
              className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-black outline-none"
            >
              <option value="">Select Size</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
              <option>XXL</option>
            </select>

            {/* Quantity */}
            <input
              type="number"
              min="1"
              required
              placeholder="Quantity"
              className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-black outline-none"
            />

            {/* Idea */}
            <textarea
              required
              rows="4"
              placeholder="Describe your design idea, text, anime character, logo, color preferences, etc."
              className="w-full border px-4 py-3 rounded-md focus:ring-2 focus:ring-black outline-none"
            />

            {/* File Upload */}
            <input
              type="file"
              className="w-full"
            />

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
            >
              Submit Custom Request
            </button>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Request Submitted 🎉</h2>
            <p className="text-gray-700">
              Thank you for your custom order request!  
              Our team will contact you shortly with pricing and next steps.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
