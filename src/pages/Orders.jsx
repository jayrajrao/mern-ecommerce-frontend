// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { getMyOrders, requestReturn } from "../services/order.service";

// const statusColors = {
//   pending: "bg-yellow-100 text-yellow-800",
//   processing: "bg-blue-100 text-blue-800",
//   shipped: "bg-purple-100 text-purple-800",
//   delivered: "bg-green-100 text-green-800",
//   cancelled: "bg-red-100 text-red-800",
// };

// const returnStatusColors = {
//   none: "",
//   requested: "bg-yellow-100 text-yellow-800",
//   approved: "bg-blue-100 text-blue-800",
//   rejected: "bg-red-100 text-red-800",
//   completed: "bg-green-100 text-green-800",
// };

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [returnModalOrder, setReturnModalOrder] = useState(null);
//   const [returnReason, setReturnReason] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const data = await getMyOrders();
//       setOrders(data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const openReturnModal = (order) => {
//     setReturnModalOrder(order);
//     setReturnReason("");
//   };

//   const closeReturnModal = () => {
//     setReturnModalOrder(null);
//     setReturnReason("");
//   };

//   const handleReturnSubmit = async () => {
//     if (!returnReason.trim()) {
//       toast.error("Please enter a reason");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       await requestReturn(returnModalOrder._id, returnReason);
//       toast.success("Return request submitted");
//       closeReturnModal();
//       fetchOrders(); // refresh list to show updated returnStatus
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to submit return request");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div className="p-8">Loading your orders...</div>;

//   return (
//     <div className="max-w-3xl p-8 mx-auto">
//       <h2 className="mb-6 text-2xl font-bold">My Orders</h2>

//       {orders.length === 0 ? (
//         <p className="text-gray-500">You haven't placed any orders yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <div key={order._id} className="p-5 bg-white rounded-lg shadow">
//               <div className="flex items-start justify-between mb-3">
//                 <div>
//                   <p className="text-sm text-gray-500">Order ID: {order._id}</p>
//                   <p className="text-sm text-gray-500">
//                     Placed on: {new Date(order.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <span
//                   className={`px-3 py-1 text-xs rounded-full ${statusColors[order.orderStatus]}`}
//                 >
//                   {order.orderStatus}
//                 </span>
//               </div>

//               <div className="pt-3 space-y-2 border-t">
//                 {order.items.map((item, idx) => (
//                   <div key={idx} className="flex justify-between text-sm">
//                     <span>
//                       {item.product?.name || "Product"} × {item.quantity}
//                     </span>
//                     <span>₹{item.price * item.quantity}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex items-center justify-between pt-3 mt-3 border-t">
//                 <p className="font-semibold">Total: ₹{order.totalAmount}</p>

//                 {order.returnStatus !== "none" ? (
//                   <span
//                     className={`px-3 py-1 text-xs rounded-full ${returnStatusColors[order.returnStatus]}`}
//                   >
//                     Return: {order.returnStatus}
//                   </span>
//                 ) : (
//                   order.orderStatus === "delivered" && (
//                     <button
//                       onClick={() => openReturnModal(order)}
//                       className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
//                     >
//                       Request Return
//                     </button>
//                   )
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Return Reason Modal */}
//       {returnModalOrder && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="w-full max-w-md p-6 bg-white rounded-lg">
//             <h3 className="mb-4 text-lg font-bold">Request Return</h3>
//             <textarea
//               placeholder="Why do you want to return this order?"
//               value={returnReason}
//               onChange={(e) => setReturnReason(e.target.value)}
//               rows={4}
//               className="w-full p-2 mb-4 border rounded"
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={closeReturnModal}
//                 className="px-4 py-2 border rounded hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleReturnSubmit}
//                 disabled={submitting}
//                 className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
//               >
//                 {submitting ? "Submitting..." : "Submit"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyOrders, requestReturn } from "../services/order.service";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const returnStatusColors = {
  none: "",
  requested: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openReturnModal = (order) => {
    setReturnModalOrder(order);
    setReturnReason("");
  };

  const closeReturnModal = () => {
    setReturnModalOrder(null);
    setReturnReason("");
  };

  const handleReturnSubmit = async () => {
    if (!returnReason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    try {
      setSubmitting(true);
      await requestReturn(returnModalOrder._id, returnReason);
      toast.success("Return request submitted");
      closeReturnModal();
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit return request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading your orders...</div>;

  return (
    <div className="max-w-3xl p-8 mx-auto">
      <h2 className="mb-6 text-2xl font-bold">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="p-5 bg-white rounded-lg shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${statusColors[order.orderStatus]}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="pt-3 space-y-2 border-t">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.product?.name || "Product"} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t">
                <p className="font-semibold">Total: ₹{order.totalAmount}</p>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/orders/${order._id}`}
                    className="px-4 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Track Order
                  </Link>

                  {order.returnStatus !== "none" ? (
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${returnStatusColors[order.returnStatus]}`}
                    >
                      Return: {order.returnStatus}
                    </span>
                  ) : (
                    order.orderStatus === "delivered" && (
                      <button
                        onClick={() => openReturnModal(order)}
                        className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Request Return
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {returnModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-bold">Request Return</h3>
            <textarea
              placeholder="Why do you want to return this order?"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              rows={4}
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeReturnModal}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReturnSubmit}
                disabled={submitting}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;