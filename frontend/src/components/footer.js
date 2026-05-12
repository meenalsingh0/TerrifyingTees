import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* BRAND */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            TerrifyingTees
          </h3>
          <p className="text-sm text-gray-400">
            Premium streetwear & custom tees crafted for comfort, style, and attitude.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">
            Company
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white transition">
                Our Collection
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">
            Support
          </h4>
          <ul className="space-y-2 text-sm">
            <li>Shipping & Returns</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} TerrifyingTees. All rights reserved.
      </div>
    </footer>
  );
}
