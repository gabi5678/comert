import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error(error);
       toast.error("Error loading commands");    
} finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, orderStatus) => {
    try {
      await api.put(
        `/orders/${orderId}/status`,
        { orderStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchOrders();
      toast.success("Status updated");
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 rounded-[32px] bg-gradient-to-r from-pink-300 via-pink-200 to-rose-200 p-8 shadow-xl">
        <h1 className="text-4xl font-black text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-700">Manage orders and site activity</p>
      </div>

      {loading ? (
        <div className="rounded-[28px] bg-white p-8 shadow-lg">Loading orders...</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-[28px] bg-white p-6 shadow-lg">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {order.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-500">
                    User: {order.userId}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-pink-600">{order.total} RON</p>
                  <p className="text-sm text-gray-500">
                    Payment: {order.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="mb-4 text-sm text-gray-600">
                <p>
                  <span className="font-semibold text-gray-900">Shipping:</span>{" "}
                  {order.shippingAddress?.fullName}, {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.street}
                </p>
              </div>

              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-gray-900">Items</p>
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-2xl bg-pink-50 px-4 py-3 text-sm"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{(item.price * item.quantity).toFixed(2)} RON</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(order.id, status)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      order.orderStatus === status
                        ? "bg-pink-600 text-white"
                        : "bg-pink-50 text-pink-600 hover:bg-pink-100"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}