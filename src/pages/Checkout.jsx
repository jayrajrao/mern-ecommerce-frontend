import { useCart } from "../context/CartContext";
import {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../services/payment.service";
import toast from "react-hot-toast";

function Checkout() {
  const { cartItems } = useCart();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    try {
      // ✅ guard
      if (!cartItems.length) {
        return toast.error("Cart is empty");
      }

      // ✅ create DB order (NO PAYLOAD)
      const orderRes = await createOrder();

      console.log("orderRes:", orderRes);

      const orderId = orderRes?.order?._id;

      if (!orderId) {
        return toast.error("Order creation failed");
      }

      // ✅ create razorpay order
      const data = await createRazorpayOrder(orderId);

      // ✅ safety check
      if (!window.Razorpay) {
        return toast.error("Razorpay SDK not loaded");
      }

      const options = {
        key: data.key,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "My Store",
        description: "Order Payment",
        order_id: data.razorpayOrder.id,

        handler: async function (response) {
          try {
            await verifyRazorpayPayment(response);
            toast.success("Payment successful 🎉");
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed");
          }
        },

        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed to start");
    }
  };

  return (
    <div className="max-w-4xl px-4 py-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="p-4 mb-6 bg-white shadow rounded-xl">
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between mb-2">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <hr className="my-3" />

        <p className="text-xl font-semibold text-right">
          Total: ₹{total}
        </p>
      </div>

      <button
        onClick={handlePayment}
        className="w-full py-3 text-white transition bg-black rounded-xl hover:bg-gray-800"
      >
        Pay Now
      </button>
    </div>
  );
}

export default Checkout;