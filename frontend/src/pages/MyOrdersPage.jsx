import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import toast from "react-hot-toast";

export default function MyOrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message || "Nu am putut încărca comenzile.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const handleDownloadInvoice = async (orderId, orderNumber) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `factura-${orderNumber || orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Could not download invoice.",
      );
      console.error("Eroare la descărcarea facturii:", err);
      alert(err?.response?.data?.message || "Nu s-a putut descărca factura.");
    }
  };

  if (!user) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-black text-gray-900">
          You must be logged in
        </h1>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 rounded-[36px] bg-gradient-to-r from-pink-300 via-pink-200 to-rose-200 px-8 py-10 shadow-xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-pink-700">
          Account
        </p>
        <h1 className="text-4xl font-black text-gray-900">My Orders</h1>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading orders...</div>
      ) : error ? (
        <div className="rounded-[32px] bg-white p-10 text-center shadow-lg">
          <p className="text-red-500">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-[32px] bg-white p-10 text-center shadow-lg">
          <p className="text-gray-500">You have no orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-[36px] bg-white p-6 shadow-md transition hover:shadow-xl"
            >
              {/* HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pink-100 pb-4">
                <div>
                <span>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                    No Order: 
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {order.orderNumber}
                  </p>
                  </span>

                  <p className="mt-1 text-xs text-gray-500">
                 {order.createdAt
  ? new Date(
      order.createdAt.seconds
        ? order.createdAt.seconds * 1000
        : order.createdAt._seconds
        ? order.createdAt._seconds * 1000
        : order.createdAt
    ).toLocaleDateString()
  : "—"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-black text-pink-600">
                    {order.total} RON
                  </p>

                  <span className="mt-1 inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-600">
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="mt-5 space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 rounded-2xl bg-pink-50 p-3 transition hover:bg-pink-100"
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/80"}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>

                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold text-gray-900">{item.price} RON</p>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex items-center justify-between border-t border-pink-100 pt-4">
                <p className="text-xs text-gray-400">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </p>

                <button
                  onClick={() =>
                    handleDownloadInvoice(order.id, order.orderNumber)
                  }
                  className="rounded-full bg-pink-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-pink-500 active:scale-95"
                >
                  Download Invoice
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
