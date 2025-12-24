import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { FaUser, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";





export default function Navbar() {
    const { cartCount } = useCart();
    const { user, isAuthenticated } = useAuth();


  return (
    <nav className="bg-black text-white p-2 flex justify-between items-center shadow-md sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold tracking-tight">
        TerrifyingTees
      </Link>
      <div className="flex space-x-5">
      <Link href="/cart" className="relative hover:text-gray-300"><FaShoppingCart size={22} />
      {cartCount > 0 && (<span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
      {cartCount}
    </span>)}
  </Link>
  {isAuthenticated ? (
  // SHOW PROFILE ICON IF LOGGED IN
  <Link href="/profile" className="hover:text-gray-300 flex items-center gap-2">
    <FaUserCircle size={24} />
  </Link>
) : (
  // SHOW LOGIN ICON IF NOT LOGGED IN
  <Link href="/login" className="hover:text-gray-300 flex items-center gap-2">
    <FaUser size={20} />
  </Link>
)}


    
  </div>
  </nav>
  );
}

