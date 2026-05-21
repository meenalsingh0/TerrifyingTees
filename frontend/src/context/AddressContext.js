// ─────────────────────────────────────────────────────────────────
// AddressContext — Backend-connected addresses with guest fallback
// ─────────────────────────────────────────────────────────────────
//
// Strategy:
//   • Unauthenticated users → addresses live in localStorage
//     under key "guestAddresses", IDs use "guest-" + Date.now()
//   • Authenticated users   → all operations hit /addresses API;
//     state is re-fetched after every mutation for correctness
//   • Guest addresses are NOT auto-migrated on login — user
//     re-adds them via profile if desired
//
// Exposed context value:
//   {
//     addresses,        — array of address objects
//     selectedId,       — ID of address selected for checkout
//     setSelectedId,    — user picks an address on checkout page
//     selectedAddress,  — full object for selectedId (useMemo)
//     defaultAddress,   — full object where isDefault=true (useMemo)
//     loading,          — true during initial fetch
//     addAddress,       — POST /addresses or localStorage
//     updateAddress,    — PATCH /addresses/:id or localStorage
//     removeAddress,    — DELETE /addresses/:id or localStorage
//     setDefaultAddress — PATCH /addresses/:id/default or localStorage
//   }
//
// Address object shape (same for guest and backend):
//   { id, name, phone, street, city, state, pincode, isDefault }
// ─────────────────────────────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "./AuthContext";

const AddressContext = createContext();

// ─── localStorage key for guest addresses ───
const GUEST_ADDRESSES_KEY = "guestAddresses";

// ─── Guest address helpers ───

function loadGuestAddresses() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_ADDRESSES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveGuestAddresses(addresses) {
  localStorage.setItem(GUEST_ADDRESSES_KEY, JSON.stringify(addresses));
}

export function AddressProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Fetch addresses from backend ───
  const fetchAddresses = useCallback(async () => {
    try {
      const data = await apiFetch("/addresses");
      setAddresses(data);
    } catch (err) {
      console.error("[AddressContext] fetchAddresses failed:", err);
    }
  }, []);

  // ─── React to auth state changes ───
  // Authenticated: fetch from API. Not authenticated: load from localStorage.
  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated) {
      fetchAddresses().finally(() => setLoading(false));
    } else {
      setAddresses(loadGuestAddresses());
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, fetchAddresses]);

  // ─── Auto-select the default address when addresses change ───
  // Sets selectedId to the default address on initial load / after
  // the address list changes. If no default exists, picks the first one.
  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedId(null);
      return;
    }
    const def = addresses.find((a) => a.isDefault);
    setSelectedId(def ? def.id : addresses[0].id);
  }, [addresses]);

  // ─── Derived state (memoized) ───
  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedId) || null,
    [addresses, selectedId]
  );

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault) || null,
    [addresses]
  );

  // ─── addAddress ───
  // Authenticated: POST /addresses then re-fetch for correctness
  // Guest: append to localStorage; first address always becomes default
  const addAddress = useCallback(
    async (addressData) => {
      if (isAuthenticated) {
        await apiFetch("/addresses", {
          method: "POST",
          body: JSON.stringify(addressData),
        });
        // Re-fetch to get the canonical state from the backend
        await fetchAddresses();
      } else {
        const current = loadGuestAddresses();
        const isFirst = current.length === 0;
        const newAddr = {
          id: "guest-" + Date.now(),
          name: addressData.name,
          phone: addressData.phone,
          street: addressData.street,
          city: addressData.city,
          state: addressData.state,
          pincode: addressData.pincode,
          // First address is always default
          isDefault: isFirst || addressData.isDefault === true,
        };

        // If new address is default, unset all existing defaults
        let updated = current;
        if (newAddr.isDefault) {
          updated = current.map((a) => ({ ...a, isDefault: false }));
        }
        updated.push(newAddr);
        saveGuestAddresses(updated);
        setAddresses([...updated]);
      }
    },
    [isAuthenticated, fetchAddresses]
  );

  // ─── updateAddress ───
  // Authenticated: PATCH /addresses/:id then re-fetch
  // Guest: update in localStorage
  const updateAddress = useCallback(
    async (addressId, addressData) => {
      if (isAuthenticated) {
        await apiFetch(`/addresses/${addressId}`, {
          method: "PATCH",
          body: JSON.stringify(addressData),
        });
        await fetchAddresses();
      } else {
        let current = loadGuestAddresses();
        // If setting as default, unset all others first
        if (addressData.isDefault === true) {
          current = current.map((a) => ({ ...a, isDefault: false }));
        }
        const updated = current.map((a) =>
          a.id === addressId ? { ...a, ...addressData } : a
        );
        saveGuestAddresses(updated);
        setAddresses([...updated]);
      }
    },
    [isAuthenticated, fetchAddresses]
  );

  // ─── removeAddress ───
  // Authenticated: DELETE /addresses/:id then re-fetch
  // Guest: remove from localStorage; auto-promote first remaining if deleted was default
  const removeAddress = useCallback(
    async (addressId) => {
      if (isAuthenticated) {
        await apiFetch(`/addresses/${addressId}`, {
          method: "DELETE",
        });
        await fetchAddresses();
      } else {
        const current = loadGuestAddresses();
        const removed = current.find((a) => a.id === addressId);
        let updated = current.filter((a) => a.id !== addressId);

        // If the deleted address was the default, promote the first remaining
        if (removed?.isDefault && updated.length > 0) {
          updated[0] = { ...updated[0], isDefault: true };
        }

        saveGuestAddresses(updated);
        setAddresses([...updated]);
      }
    },
    [isAuthenticated, fetchAddresses]
  );

  // ─── setDefaultAddress ───
  // Authenticated: PATCH /addresses/:id/default then re-fetch
  // Guest: unset all defaults in localStorage, set this one
  const setDefaultAddress = useCallback(
    async (addressId) => {
      if (isAuthenticated) {
        await apiFetch(`/addresses/${addressId}/default`, {
          method: "PATCH",
        });
        await fetchAddresses();
      } else {
        const current = loadGuestAddresses();
        const updated = current.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        }));
        saveGuestAddresses(updated);
        setAddresses([...updated]);
      }
    },
    [isAuthenticated, fetchAddresses]
  );

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedId,
        setSelectedId,
        selectedAddress,
        defaultAddress,
        loading,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  return useContext(AddressContext);
}
