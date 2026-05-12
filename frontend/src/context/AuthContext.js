// ─────────────────────────────────────────────────────
// AuthContext — Frontend auth state powered by backend
// ─────────────────────────────────────────────────────
// This context connects to the NestJS backend for:
//   • Login   → POST /api/v1/auth/login
//   • Signup  → POST /api/v1/auth/register
//   • Logout  → POST /api/v1/auth/logout
//   • Profile → GET  /api/v1/users/me
//
// Tokens (JWT) are stored in localStorage and managed
// by the api.js helper which auto-refreshes on 401.
// ─────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useState } from "react";
import {
  apiFetch,
  setTokens,
  clearTokens,
  getAccessToken,
} from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking saved session

  // ─── AUTH: Load user on mount (if token exists) ───
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    // Validate token by fetching the user's profile
    apiFetch("/users/me")
      .then((data) => setUser(data))
      .catch(() => {
        // Token invalid or expired beyond refresh — clear it
        clearTokens();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ─── AUTH: Login ───
  const login = async (email, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // AUTH — Store tokens returned by backend
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data;
  };

  // ─── AUTH: Signup / Register ───
  const signup = async (email, password, firstName, lastName) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    // AUTH — Store tokens (user is logged in after signup)
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data;
  };

  // ─── AUTH: Logout ───
  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Even if backend call fails, clear local state
    }
    clearTokens();
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
