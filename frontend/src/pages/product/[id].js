import { useRouter } from "next/router";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import ProductCard from "@/components/productCard";
import SizeSelector from "../../components/sizeSelector";
import AddToCartButton from "../../components/addToCartButton";
import { apiFetch } from "../../lib/api";

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;

  const [selectedSize, setSelectedSize] = useState(null);
  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    // Fetch product details
    apiFetch(`/products/${id}`)
      .then((data) => {
        setProduct(data);
        // Also fetch some recommended products
        apiFetch("/products?limit=3")
          .then((res) => {
            setRecommended(res.data?.filter((p) => p.id !== id).slice(0, 3) || []);
          })
          .catch(console.error);
      })
      .catch((err) => setError("Failed to load product details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error || !product) return <div className="p-10 text-center text-red-500">{error || "Product not found"}</div>;

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">

        {/* IMAGE */}
        <div className="flex-1">
          <img
            src={product.imageUrl || "/ichigo black tee.png"}
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
            <SizeSelector
              sizes={["S", "M", "L", "XL"]}
              value={selectedSize}
              onChange={setSelectedSize}
              label={`Select size for ${product.name}`}
            />
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* ADD TO CART */}
          <AddToCartButton
            disabled={!selectedSize}
            onAdd={() =>
              addToCart({
                ...product,
                image: product.imageUrl || "/ichigo black tee.png",
                size: selectedSize,
              })
            }
          />
          
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
      {recommended.length > 0 && (
        <div className="mt-16 max-w-6xl mx-auto px-6 mb-16">
          <h2 className="text-3xl font-bold mb-8">You may also like</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {recommended.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                image={item.imageUrl || "/ichigo black tee.png"}
              />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
