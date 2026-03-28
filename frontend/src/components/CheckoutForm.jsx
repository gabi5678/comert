import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CheckoutForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    try {
      await api.post(
        `/payments/confirm/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 ALERT + REDIRECT
      alert("Comanda ta a fost finalizată cu succes! 🎉");

      navigate("/"); // homepage
    } catch (err) {
      console.error(err);
      alert("Plata a fost făcută, dar backend-ul nu a confirmat.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <button
        disabled={!stripe || loading}
        className="w-full rounded-full bg-pink-600 py-4 text-white font-semibold hover:bg-pink-500"
      >
        {loading ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}