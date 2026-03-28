import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripe";
import CheckoutForm from "../components/CheckoutForm";

export default function PaymentPage() {
  const { orderId } = useParams();
  const { token } = useAuth();

  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const res = await api.post(
          `/payments/create-payment-intent/${orderId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.error(error);
        toast.error("Error payment");
      }
    };

    if (orderId && token) {
      createPaymentIntent();
    }
  }, [orderId, token]);

  if (!clientSecret) {
    return <p className="p-10">Loading payment...</p>;
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="rounded-[32px] bg-white p-10 shadow-xl">
        <h1 className="mb-6 text-4xl font-black text-gray-900">
          Complete Payment
        </h1>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm orderId={orderId} />
        </Elements>
      </div>
    </section>
  );
}