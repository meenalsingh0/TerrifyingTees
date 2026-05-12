import Link from "next/link";

export default function Banner() {
  return (
    <section
      className="w-full h-[70vh] md:h-[100vh] bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('/banner2.png')",
      }}
    >
      {/* Dark overlay to increase text visibility */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center text-center h-full relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-widest text-white">
          NEW COLLECTION
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-semibold text-white/90">
          LIVE NOW
        </p>
         <button className="mt-8 bg-white text-black font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition">
          <Link href="/products"> SHOP NOW </Link>
        </button>
      </div>
    </section>
  );
}
