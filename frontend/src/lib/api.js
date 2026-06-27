// ─────────────────────────────────────────────────────────
// API Helper — Centralized fetch wrapper for backend calls
// ─────────────────────────────────────────────────────────
// All backend requests go through this module.
// It handles:
//   • Base URL prefixing
//   • JWT access token injection (Authorization header)
//   • Automatic token refresh on 401 responses
//   • Token storage in localStorage
// ─────────────────────────────────────────────────────────

const API_BASE =
   `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
//"/api/v1"; // proxied to http://localhost:3001/api/v1 via next.config.mjs

// ─── Token helpers (localStorage) ───

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// ─── Core fetch wrapper ───

/**
 * Makes an authenticated request to the backend API.
 *
 * @param {string}  endpoint  — API path, e.g. "/auth/login"
 * @param {object}  options   — Standard fetch options (method, body, headers, etc.)
 * @returns {Promise<any>}    — Parsed JSON response
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  // Build headers — attach JWT if available
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // First attempt
  let res = await fetch(url, { ...options, headers });

  // ─── Auto-refresh on 401 ───
  // If the access token expired, try refreshing it once
  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Retry the original request with the new token
      headers["Authorization"] = `Bearer ${getAccessToken()}`;
      res = await fetch(url, { ...options, headers });
    }
  }

  // Parse response
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const error = new Error(Array.isArray(message) ? message.join(", ") : message);
    error.status = res.status;
    throw error;
  }

  return data;
}

// ─── Token refresh logic ───

async function tryRefreshToken() {
  try {
    const refreshToken = getRefreshToken();
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!res.ok) {
      clearTokens();
      return false;
    }

    const data = await res.json();
    // AUTH — Store new tokens from refresh response
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}
