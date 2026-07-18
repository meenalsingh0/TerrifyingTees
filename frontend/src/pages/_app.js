import "@/styles/globals.css";
import { Rubik_Dirt, Inter } from "next/font/google";
import { CartProvider } from "../context/CartContext";
// AUTH — AuthContext now connects to the NestJS backend (not local frontend auth)
import { AuthProvider } from "../context/AuthContext";
import { AddressProvider } from "../context/AddressContext";
import { CartUiProvider } from "../context/CartUiContext";
import CartDrawer from "../components/cartDrawer";
import GrainOverlay from "../components/grainOverlay";
import PageTransition from "../components/motion/PageTransition";
import SmoothScroll from "../components/motion/SmoothScroll";

// Distressed bold grotesk for display headlines; single weight by design.
const display = Rubik_Dirt({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }) {
  return (
    // AUTH — AuthProvider wraps everything so all pages can access auth state
    <AuthProvider>
      <CartProvider>
        <AddressProvider>
          <CartUiProvider>
            <div className={`${display.variable} ${inter.variable} font-sans`}>
              <SmoothScroll />
              <PageTransition>
                <Component {...pageProps} />
              </PageTransition>
              <CartDrawer />
              <GrainOverlay />
            </div>
          </CartUiProvider>
        </AddressProvider>
      </CartProvider>
    </AuthProvider>
  );
}