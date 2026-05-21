// ─────────────────────────────────────────────────────────────────
// CartContext — Backend-connected cart with guest-cart fallback
// ─────────────────────────────────────────────────────────────────
//
// Strategy:
//   • Unauthenticated users → guest cart in localStorage
//   • Authenticated users   → backend cart via /api/v1/cart
//   • On login              → guest items are merged into backend
//                             cart via POST /cart/merge, then
//                             localStorage guest cart is cleared
//   • On logout             → backend state is dropped; cart empties
//
// Exposed shape of every cart item (same for guest + backend):
//   {
//     cartItemId : string   — backend UUID, or "guest-N" for guests
//     productId  : string   — product UUID
//     name       : string
//     price      : number
//     image      : string
//     size       : string | null   — stored in sizeMap (localStorage)
//     quantity   : number
//   }
//
// Size note: the backend CartItem has no `size` column yet. Until
// the schema is updated, sizes are persisted in a localStorage
// sizeMap keyed by productId. If the same product is ordered in
// two different sizes only one size is remembered — fix this once
// a `size` field is added to the CartItem model.
// ─────────────────────────────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

// ─── localStorage keys ───
const GUEST_CART_KEY = "guestCartItems";
const SIZE_MAP_KEY   = "cartSizeMap"; // { [productId]: size }

// ─── Guest cart helpers ───
function loadGuestCart() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]"); }
  catch { return []; }
}
function saveGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

// ─── Size map helpers ───
function loadSizeMap() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(SIZE_MAP_KEY) || "{}"); }
  catch { return {}; }
}
function saveSizeMap(map) {
  localStorage.setItem(SIZE_MAP_KEY, JSON.stringify(map));
}

// ─── Normalize backend CartResponseDto → frontend shape ───
function normalizeBackendCart(backendCart) {
  const sizeMap = loadSizeMap();
  return (backendCart.cartItems || []).map((item) => ({
    cartItemId : item.id,
    productId  : item.productId,
    name       : item.product.name,
    price      : Number(item.product.price),
    image      : item.product.imageUrl || "/ichigo black tee.png",
    size       : sizeMap[item.productId] || null,
    quantity   : item.quantity,
  }));
}

export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading]     = useState(true);

  // Track previous auth state so we can detect the login transition
  const prevAuthRef = useRef(null);

  // ─── Fetch authenticated cart from backend ───
  const fetchCart = useCallback(async () => {
    try {
      const data = await apiFetch("/cart");
      setCartItems(normalizeBackendCart(data));
    } catch (err) {
      console.error("[CartContext] fetchCart failed:", err);
    }
  }, []);

  // ─── Merge guest cart into backend cart then fetch ───
  const mergeGuestCartAndFetch = useCallback(async () => {
    const guestItems = loadGuestCart();
    if (guestItems.length > 0) {
      const mergePayload = guestItems.map((item) => ({
        productId : item.productId,
        quantity  : item.quantity,
      }));
      try {
        const data = await apiFetch("/cart/merge", {
          method : "POST",
          body   : JSON.stringify({ items: mergePayload }),
        });
        setCartItems(normalizeBackendCart(data));
      } catch {
        // Merge failed — still fetch whatever the backend has
        await fetchCart();
      }
    } else {
      await fetchCart();
    }
    // Guest cart has been synced — clear it
    saveGuestCart([]);
  }, [fetchCart]);

  // ─── React to auth state changes ───
  useEffect(() => {
    if (authLoading) return;

    const prev = prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    if (isAuthenticated) {
      if (prev === false) {
        // User just logged in → merge, then fetch
        mergeGuestCartAndFetch().finally(() => setLoading(false));
      } else {
        // First mount while already authenticated → just fetch
        fetchCart().finally(() => setLoading(false));
      }
    } else {
      // Not authenticated → show guest cart
      setCartItems(loadGuestCart());
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, fetchCart, mergeGuestCartAndFetch]);

  // ─── addToCart ───
  // product shape expected from product page:
  //   { id (productId), name, price, imageUrl, size }
  const addToCart = useCallback(
    async (product) => {
      const { id: productId, name, price, imageUrl, image, size } = product;

      if (isAuthenticated) {
        // Save size before calling API (keyed by productId)
        const sizeMap = loadSizeMap();
        if (size) { sizeMap[productId] = size; saveSizeMap(sizeMap); }

        const data = await apiFetch("/cart/items", {
          method : "POST",
          body   : JSON.stringify({ productId, quantity: 1 }),
        });
        setCartItems(normalizeBackendCart(data));
      } else {
        // Guest cart — group by productId + size
        const items = loadGuestCart();
        const existingIdx = items.findIndex(
          (i) => i.productId === productId && i.size === size
        );
        if (existingIdx >= 0) {
          items[existingIdx].quantity += 1;
        } else {
          items.push({
            cartItemId : `guest-${Date.now()}`,
            productId,
            name,
            price      : Number(price),
            image      : image || imageUrl || "/ichigo black tee.png",
            size       : size || null,
            quantity   : 1,
          });
        }
        saveGuestCart(items);
        setCartItems([...items]);
      }
    },
    [isAuthenticated]
  );

  // ─── removeFromCart ───
  // cartItemId: backend UUID for authenticated users,
  //             "guest-N" string for guests
  const removeFromCart = useCallback(
    async (cartItemId) => {
      if (isAuthenticated) {
        const data = await apiFetch(`/cart/items/${cartItemId}`, {
          method: "DELETE",
        });
        // Clean up sizeMap entry for the removed item
        const removed = cartItems.find((i) => i.cartItemId === cartItemId);
        if (removed) {
          const sizeMap = loadSizeMap();
          delete sizeMap[removed.productId];
          saveSizeMap(sizeMap);
        }
        setCartItems(normalizeBackendCart(data));
      } else {
        const items = loadGuestCart().filter((i) => i.cartItemId !== cartItemId);
        saveGuestCart(items);
        setCartItems([...items]);
      }
    },
    [isAuthenticated, cartItems]
  );

  // ─── updateQuantity ───
  // Authenticated: PATCH /cart/items/:id  { quantity }
  // Guest: update in localStorage
  const updateQuantity = useCallback(
    async (cartItemId, quantity) => {
      if (quantity < 1) return;

      if (isAuthenticated) {
        const data = await apiFetch(`/cart/items/${cartItemId}`, {
          method : "PATCH",
          body   : JSON.stringify({ quantity }),
        });
        setCartItems(normalizeBackendCart(data));
      } else {
        const items = loadGuestCart().map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity } : i
        );
        saveGuestCart(items);
        setCartItems([...items]);
      }
    },
    [isAuthenticated]
  );

  // ─── clearCart ───
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      const data = await apiFetch("/cart", { method: "DELETE" });
      saveSizeMap({});
      setCartItems(normalizeBackendCart(data));
    } else {
      saveGuestCart([]);
      setCartItems([]);
    }
  }, [isAuthenticated]);

  // ─── Derived values ───
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}