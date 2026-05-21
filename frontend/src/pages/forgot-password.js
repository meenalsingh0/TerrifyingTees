import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");
    if (!email) return setError("Email is required");
    if (!validateEmail(email)) return setError("Please enter a valid email");

    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center py-16 px-4">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-2">Forgot Password</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Enter your email address and we will send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
              {message}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 ${
                email && !validateEmail(email)
                  ? "border-red-500 ring-red-400"
                  : "focus:ring-black"
              }`}
            />

            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 mb-4"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-gray-500 hover:text-black hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
