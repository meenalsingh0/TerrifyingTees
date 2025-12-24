import "@/styles/globals.css";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { AddressProvider } from "../context/AddressContext";


export default function App({ Component, pageProps }) {
  return (

    <CartProvider>
      <AuthProvider>
        <AddressProvider>
          <Component {...pageProps} />
        </AddressProvider>
      </AuthProvider>
    </CartProvider>

  );
}