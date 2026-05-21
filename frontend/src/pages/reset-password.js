import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useRouter } from "next/router";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setError("");
    setMessage("");
    if (!newPassword) return setError("New password is required");
    if (newPassword.length < 8) return setError("Password must be at least 8 characters long");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    if (!token) return setError("Invalid or missing token");

    setLoading(true);
    try {
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(data.message);
      // Optional: auto-redirect after a few seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
          <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Enter your new password below.
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
              type="password"
              placeholder="New Password (min 8 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
            
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading || !!message}
              className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 mb-4"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            
            {message && (
              <div className="text-center text-sm text-gray-500">
                Redirecting to login...
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
