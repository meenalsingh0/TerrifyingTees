import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useRouter } from "next/router";
import { useAddress } from "../context/AddressContext";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout, isAuthenticated, loading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login?redirect=/profile");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) return <div className="p-10 text-center">Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-8">

          {/* SIDEBAR */}
          <div className="w-full md:w-1/4 bg-white rounded-lg shadow p-4 space-y-2">
            <SidebarButton label="Account Overview" tab="overview" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarButton label="My Orders" tab="orders" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarButton label="Order Tracking" tab="tracking" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarButton label="Addresses & Billing" tab="address" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarButton label="Wishlist" tab="wishlist" activeTab={activeTab} setActiveTab={setActiveTab} />

            <button
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>

          {/* CONTENT */}
          <div className="w-full md:w-3/4 bg-white rounded-lg shadow p-6">
            {activeTab === "overview" && <Overview user={user} />}
            {activeTab === "orders" && <Orders />}
            {activeTab === "tracking" && <Tracking />}
            {activeTab === "address" && <Address />}
            {activeTab === "wishlist" && <Wishlist />}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SidebarButton({ label, tab, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full text-left px-4 py-2 rounded-md transition ${
        activeTab === tab
          ? "bg-black text-white"
          : "hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

function Overview({ user }) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Account Overview</h2>
      <p className="text-gray-500 mb-2">
        Welcome to your TerrifyingTees account, {user?.firstName || user?.email}!
      </p>
      <p className="text-gray-600 mb-2"><b>Email:</b> {user?.email}</p>
      <p className="text-gray-500">Manage your orders, addresses, and wishlist here.</p>
    </>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/orders")
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => console.error("Failed to load orders", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold">Order #{order.orderNumber}</p>
                <p className="text-gray-600 text-sm">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm font-medium mt-1">Total: ₹{order.totalAmount}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Tracking() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
      <p className="text-gray-500">
        Track your orders once they are shipped.
      </p>
    </>
  );
}

function Address() {
  const { addresses, addAddress } = useAddress();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleSubmit = () => {
    addAddress(form);
    setForm({ name:"", phone:"", street:"", city:"", state:"", pincode:"" });
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Saved Addresses</h2>

      {addresses.length === 0 && (
        <p className="text-gray-500 mb-4">No addresses saved yet.</p>
      )}

      {addresses.map((addr, i) => (
        <div key={i} className="border p-4 rounded mb-3">
          <p className="font-semibold">{addr.name}</p>
          <p>{addr.street}, {addr.city}</p>
          <p>{addr.state} - {addr.pincode}</p>
          <p>{addr.phone}</p>
        </div>
      ))}

      <h3 className="text-xl font-semibold mt-6 mb-2">Add New Address</h3>

      {["name","phone","street","city","state","pincode"].map((field) => (
        <input
          key={field}
          placeholder={field}
          value={form[field]}
          onChange={(e) =>
            setForm({ ...form, [field]: e.target.value })
          }
          className="w-full border px-3 py-2 rounded mb-2"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save Address
      </button>
    </>
  );
}

function Wishlist() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
      <p className="text-gray-500">
        Your wishlist is empty.
      </p>
    </>
  );
}
