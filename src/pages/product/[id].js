import { useRouter } from "next/router";
import { products } from "../../data/productsData"; // temporary static data
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import ProductCard from "@/components/productCard";


export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [selectedSize, setSelectedSize] = useState(null);

  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();

  if (!product) return <div>Loading...</div>;
  // Recommended products (excluding current product)
  const recommended = products
    .filter((p) => p.id !== product.id)
    .slice(0, 3); // show first 3 (or randomize later)


  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">

        {/* IMAGE */}
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl shadow-lg object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <p className="text-2xl font-semibold mb-6">₹{product.price}</p>

          {/* SIZE SELECTOR */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Select Size</h3>
            <div className="flex gap-3">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`
          border px-4 py-2 rounded-md transition 
          ${selectedSize === size
                      ? "bg-black text-white border-black"
                      : "hover:bg-black hover:text-white"
                    }
        `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* ADD TO CART */}
          <button
            disabled={!selectedSize}
            onClick={() => addToCart({ ...product, size: selectedSize })}
            className={`w-full py-3 rounded-lg text-lg transition 
    ${selectedSize
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {selectedSize ? "Add to Cart" : "Select a Size First"}
          </button>
          {/* REVIEWS SECTION */}
<div className="mt-10">
  <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

  <div className="space-y-6">

    {/* Review 1 */}
    <div className="p-4 border rounded-lg bg-white shadow">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-yellow-500 text-lg">★★★★★</span>
        <span className="text-sm text-gray-500">by Rahul Sharma</span>
      </div>
      <p className="text-gray-700">
        Amazing quality! The print looks premium and the fabric feels soft.
      </p>
    </div>

    {/* Review 2 */}
    <div className="p-4 border rounded-lg bg-white shadow">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-yellow-500 text-lg">★★★★☆</span>
        <span className="text-sm text-gray-500">by Priya Singh</span>
      </div>
      <p className="text-gray-700">
        Loved it! Fit is perfect. Shipping was a bit slow but the product was worth it.
      </p>
    </div>

  </div>
</div>

        </div>
      </div>

      

      {/* RECOMMENDED PRODUCTS */}
      <div className="mt-16 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8">You may also like</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {recommended.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>



      <Footer />
    </>
  );
}
