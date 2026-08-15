import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAllOrders,
  updateOrderStatus,
  updateReturnStatus,
} from "../../services/admin.service";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const RETURN_STATUSES = ["approved", "rejected", "completed"];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [actingId, setActingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders(filter ? { status: filter } : {});
      setOrders(data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleStatusChange = async (id, orderStatus) => {
    try {
      setActingId(id);
      await updateOrderStatus(id, orderStatus);
      toast.success("Order status updated");
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, orderStatus } : o))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setActingId(null);
    }
  };

  const handleReturnDecision = async (id, returnStatus) => {
    try {
      setActingId(id);
      await updateReturnStatus(id, returnStatus);
      toast.success("Return status updated");
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, returnStatus } : o))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update return status");
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <div className="p-8">Loading orders...</div>;

  return (
    <div className="max-w-5xl p-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Orders</h2>
        <Link to="/admin" className="text-sm text-gray-500 hover:text-black">
          ← Back to dashboard
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {["", ...ORDER_STATUSES].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-full border capitalize ${
              filter === s
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="p-5 bg-white rounded-lg shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">
                    Customer: {order.user?.name || "N/A"} ({order.user?.email || "N/A"})
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${statusColors[order.orderStatus]}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="pt-3 space-y-1 text-sm border-t">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.product?.name || "Product"}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t">
                <p className="font-semibold">Total: ₹{order.totalAmount}</p>

                <div className="flex items-center gap-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={actingId === order._id}
                    className="px-3 py-1.5 text-sm border rounded-md"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {order.returnStatus === "requested" && (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">
                        Return requested
                      </span>
                      {RETURN_STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleReturnDecision(order._id, s)}
                          disabled={actingId === order._id}
                          className="px-2 py-1 text-xs capitalize border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {order.returnStatus &&
                    order.returnStatus !== "none" &&
                    order.returnStatus !== "requested" && (
                      <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
                        Return: {order.returnStatus}
                      </span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;