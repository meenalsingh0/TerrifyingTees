import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ProductCard from "../components/productCard";
import { products } from "../data/productsData";

export default function ProductsPage() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="text-center py-16 bg-gradient-to-b from-gray-50 to-white">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Our Collection
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore premium tees, anime designs, and customizable styles crafted
          with comfort and durability in mind.
        </p>
      </section>

      {/* FILTER BAR (UI ONLY FOR NOW) */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap gap-4 justify-center">
          {["All", "Anime", "Oversized", "Custom", "Trending"].map((cat) => (
            <button
              key={cat}
              className="px-5 py-2 rounded-full border text-sm
                         hover:bg-black hover:text-white transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              image={p.image}
            />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
