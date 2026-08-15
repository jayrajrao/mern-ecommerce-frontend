import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrderById } from "../services/order.service";

const STEPS = ["pending", "processing", "shipped", "delivered"];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-8">Loading order...</div>;
  if (!order) return <div className="p-8">Order not found</div>;

  const currentStepIndex = STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <div className="max-w-2xl px-4 py-8 mx-auto">
      <Link to="/orders" className="text-sm text-gray-500 hover:text-black">
        ← Back to orders
      </Link>

      <div className="flex items-start justify-between mt-4 mb-6">
        <div>
          <h1 className="text-xl font-bold">Order #{order._id.slice(-8)}</h1>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs rounded-full ${statusColors[order.orderStatus]}`}
        >
          {order.orderStatus}
        </span>
      </div>

      {/* ===== Status timeline ===== */}
      {isCancelled ? (
        <div className="p-4 mb-6 text-sm text-red-700 rounded-lg bg-red-50">
          This order was cancelled.
        </div>
      ) : (
        <div className="flex items-center mb-8">
          {STEPS.map((step, idx) => {
            const reached = idx <= currentStepIndex;
            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      reached
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`mt-1 text-xs capitalize ${
                      reached ? "text-gray-800 font-medium" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      idx < currentStepIndex ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== Items ===== */}
      <div className="p-5 bg-white rounded-lg shadow">
        <h2 className="mb-3 font-semibold">Items</h2>
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>
                {item.product?.name || "Product"} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-3 mt-3 font-semibold border-t">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      {order.returnStatus && order.returnStatus !== "none" && (
        <div className="p-4 mt-4 text-sm rounded-lg bg-gray-50">
          Return status: <span className="font-medium">{order.returnStatus}</span>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;