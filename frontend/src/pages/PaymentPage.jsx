import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const { orderId } = useParams();
  const { token } = useAuth();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createIntent = async () => {
      try {
        setLoading(true);

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
        console.error("Eroare PaymentIntent:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) {
      createIntent();
    }
  }, [orderId, token]);

  const options = useMemo(() => {
    if (!clientSecret) return null;

    return {
      clientSecret,
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#ec4899",
          borderRadius: "16px",
        },
      },
    };
  }, [clientSecret]);

  if (loading) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[32px] bg-white p-10 shadow-lg">
          <p className="text-gray-500">Loading payment...</p>
        </div>
      </section>
    );
  }

  if (!clientSecret || !options) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[32px] bg-white p-10 shadow-lg">
          <p className="text-red-500">Payment could not be initialized.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-[32px] bg-white p-8 shadow-lg">
        <Elements stripe={stripePromise} options={options} key={clientSecret}>
          <CheckoutForm orderId={orderId} />
        </Elements>
      </div>
    </section>
  );
}