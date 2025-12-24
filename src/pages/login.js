import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, signup } = useAuth();
  const router = useRouter();

  // Email validation function
  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  // LOGIN HANDLER
  const handleLogin = async () => {
    if (!email) return alert("Email is required");
    if (!validateEmail(email)) return alert("Please enter a valid email");
    if (!password) return alert("Password is required");

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  // SIGNUP HANDLER
  const handleSignup = async () => {
    if (!email) return alert("Email is required");
    if (!validateEmail(email)) return alert("Please enter a valid email");
    if (!password) return alert("Password is required");

    if (password.length < 6)
      return alert("Password must be at least 6 characters long");

    try {
      await signup(email, password);
      alert("Signup successful! You can now log in.");
      setActiveTab("login");
    } catch (err) {
      alert(err.message);
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
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>

            <button
              className={`flex-1 py-2 text-lg font-semibold ${
                activeTab === "signup"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN FORM */}
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
                className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Login
              </button>
            </div>
          )}

          {/* SIGNUP FORM */}
          {activeTab === "signup" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Create Account</h2>

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
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-black"
              />

              <button
                onClick={handleSignup}
                className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
