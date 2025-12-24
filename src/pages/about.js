import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">About TerrifyingTees</h1>

        <p className="text-gray-600 mb-4 leading-relaxed">
          TerrifyingTees was created with one goal — to deliver premium-quality
          streetwear and custom-designed tees that speak attitude, creativity,
          and individuality.
        </p>

        <p className="text-gray-600 mb-4 leading-relaxed">
          We focus on comfort-first fabrics, durable prints, and designs that
          stand out. Whether you're into anime, minimal designs, or custom
          creations, TerrifyingTees is built for you.
        </p>

        <p className="text-gray-600 leading-relaxed">
          This brand is more than clothing — it's expression.
        </p>
      </div>

      <Footer />
    </>
  );
}
