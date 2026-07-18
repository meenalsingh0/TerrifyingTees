// UI-only state for the slide-out cart drawer. Cart *data* stays in
// CartContext — this only tracks whether the drawer is open.
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CartUiContext = createContext();

export function CartUiProvider({ children }) {
  const [isCartOpen, setCartOpen] = useState(false);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const value = useMemo(
    () => ({ isCartOpen, openCart, closeCart }),
    [isCartOpen, openCart, closeCart]
  );
  return <CartUiContext.Provider value={value}>{children}</CartUiContext.Provider>;
}

export function useCartUi() {
  return useContext(CartUiContext);
}
