import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, checkout } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const total = cart?.total || 0;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    street: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("The cart is empty");
      return;
    }

    try {
      setLoading(true);

      const result = await checkout(formData);

      navigate(`/payment/${result.orderId}`);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Error checkout"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 rounded-[36px] bg-gradient-to-r from-pink-300 via-pink-200 to-rose-200 px-8 py-12 shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pink-700">
          Checkout
        </p>
        <h1 className="mb-3 text-4xl font-black text-gray-900 md:text-5xl">
          Complete Your Order
        </h1>
        <p className="max-w-2xl text-gray-700">
          Introdu datele de livrare și continuă spre plată.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[32px] bg-white p-8 shadow-lg"
        >
          <h2 className="mb-6 text-2xl font-black text-gray-900">
            Shipping Address
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400 md:col-span-2"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
              required
            />

            <input
              type="text"
              name="postalCode"
              placeholder="Postal code"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
              required
            />

            <input
              type="text"
              name="street"
              placeholder="Street"
              value={formData.street}
              onChange={handleChange}
              className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="mt-6 w-full rounded-full bg-pink-600 py-4 text-base font-semibold text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </form>

        <div className="rounded-[32px] bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-black text-gray-900">
            Order Summary
          </h2>

          <div className="space-y-4">
            {items.length === 0 ? (
              <p className="text-gray-500">No products in cart.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-2xl border border-pink-100 p-3"
                >
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="font-bold text-pink-600">
                    {(item.price * item.quantity).toFixed(2)} RON
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 space-y-3 border-t border-pink-100 pt-6 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal} RON</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>20 RON</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{(Number(total) + 20).toFixed(2)} RON</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}