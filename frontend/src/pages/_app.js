import "@/styles/globals.css";
import { CartProvider } from "../context/CartContext";
// AUTH — AuthContext now connects to the NestJS backend (not local frontend auth)
import { AuthProvider } from "../context/AuthContext";
import { AddressProvider } from "../context/AddressContext";


export default function App({ Component, pageProps }) {
  return (
    // AUTH — AuthProvider wraps everything so all pages can access auth state
    <AuthProvider>
      <CartProvider>
        <AddressProvider>
          <Component {...pageProps} />
        </AddressProvider>
      </CartProvider>
    </AuthProvider>
  );
}