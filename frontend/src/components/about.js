import Link from "next/link";
export default function About() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto space-y-24">

      {/* Block 1 — Image Left, Text Right */}
      <div className="flex flex-col md:flex-row items-center gap-12">

        {/* Image */}
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1350&q=80"
          alt="Premium Quality Fabric"
          className="w-full md:w-1/2 rounded-xl shadow-lg object-cover"
        />

        {/* Text */}
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Premium Quality Tees</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            At Terrifying-Tees, every piece is made with high-grade fabric that feels soft,
            fits perfectly, and lasts long. Our prints stay sharp even after multiple washes.
            Comfort, durability, and drip — all in one tee.
          </p>

          {/* Shop Now Button */}
          <button className="mt-8 bg-black text-white font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition">
          <Link href="/products"> SHOP NOW </Link>
        </button>
        </div>

      </div>

      {/* Block 2 — Text Left, Image Right */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-12">

        {/* Image */}
        <img
          src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1350&q=80"
          alt="Custom Anime Shirts"
          className="w-full md:w-1/2 rounded-xl shadow-lg object-cover"
        />

        {/* Text */}
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Customized Tees</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Got a favorite anime scene or character? Want your own artwork on a tee?
            We offer full customization — customers can request their own designs,
            and we’ll bring them to life with high-quality prints made to last.
            Your imagination, your drip.
          </p>

          {/* Shop Now Button */}
          <button className="mt-8 bg-black text-white font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition">
          <Link href="/custom"> SHOP NOW </Link>
        </button>
        </div>

      </div>

    </section>
  );
}
