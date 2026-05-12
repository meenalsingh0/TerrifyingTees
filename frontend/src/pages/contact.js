import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

        <p className="text-gray-600 mb-8">
          Have a question, custom order request, or need support?  
          We’d love to hear from you.
        </p>

        <div className="space-y-4 text-gray-700">
          <p><b>Email:</b> support@terrifyingtees.com</p>
          <p><b>Instagram:</b> @terrifyingtees</p>
          <p><b>Business Hours:</b> Mon – Sat, 10AM – 7PM</p>
        </div>
      </div>

      <Footer />
    </>
  );
}
