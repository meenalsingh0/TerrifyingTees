// ─────────────────────────────────────────────────────
// Login / Signup Page
// ─────────────────────────────────────────────────────
// AUTH — Calls backend API via AuthContext:
//   • Login  → POST /api/v1/auth/login
//   • Signup → POST /api/v1/auth/register
//
// On success, tokens are stored and user is redirected.
// Backend requires password: min 8 chars, 1 uppercase,
// 1 lowercase, 1 number, 1 special character.
// ─────────────────────────────────────────────────────

import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
// AUTH — useAuth provides login/signup connected to backend
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // AUTH — Additional fields required by backend register endpoint
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // AUTH — login and signup functions call the backend
  const { login, signup } = useAuth();
  const router = useRouter();

  // Email validation
  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  // ─── AUTH: LOGIN HANDLER → POST /api/v1/auth/login ───
  const handleLogin = async () => {
    setError("");
    if (!email) return setError("Email is required");
    if (!validateEmail(email)) return setError("Please enter a valid email");
    if (!password) return setError("Password is required");

    setLoading(true);
    try {
      await login(email, password);
      // AUTH — Redirect to home (or where user came from)
      const redirect = router.query.redirect || "/";
      router.push(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── AUTH: SIGNUP HANDLER → POST /api/v1/auth/register ───
  const handleSignup = async () => {
    setError("");
    if (!email) return setError("Email is required");
    if (!validateEmail(email)) return setError("Please enter a valid email");
    if (!password) return setError("Password is required");
    // AUTH — Backend requires strong password
    if (password.length < 8)
      return setError("Password must be at least 8 characters long");

    setLoading(true);
    try {
      await signup(email, password, firstName || undefined, lastName || undefined);
      // AUTH — User is auto-logged in after signup, redirect to home
      router.push("/");
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
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

          {/* Tabs */}
          <div className="flex mb-6 border-b">
            <button
              className={`flex-1 py-2 text-lg font-semibold ${
                activeTab === "login"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-400"
              }`}
              onClick={() => { setActiveTab("login"); setError(""); }}
            >
              Login
            </button>

            <button
              className={`flex-1 py-2 text-lg font-semibold ${
                activeTab === "signup"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-400"
              }`}
              onClick={() => { setActiveTab("signup"); setError(""); }}
            >
              Sign Up
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ─── LOGIN FORM ─── */}
          {activeTab === "login" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Welcome Back</h2>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 ${
                  email && !validateEmail(email)
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-black"
                }`}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-black"
              />

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          )}

          {/* ─── SIGNUP FORM ─── */}
          {activeTab === "signup" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Create Account</h2>

              {/* AUTH — First and last name fields (optional in backend) */}
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  placeholder="First Name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  placeholder="Last Name (optional)"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 ${
                  email && !validateEmail(email)
                    ? "border-red-500 ring-red-400"
                    : "focus:ring-black"
                }`}
              />

              <input
                type="password"
                placeholder="Password (min 8 chars, 1 upper, 1 number, 1 special)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-black"
              />

              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
