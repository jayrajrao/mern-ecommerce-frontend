import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // ✅ safe total calculation
  const total = (cartItems || []).reduce(
    (acc, item) =>
      acc +
      Number(item.price || item.product?.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // ✅ empty state
  if (!cartItems?.length) {
    return (
      <div className="py-24 text-center">
        <h2 className="mb-4 text-2xl font-semibold">
          Your cart is empty
        </h2>

        <Link
          to="/"
          className="px-6 py-2 text-white bg-black rounded hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl px-4 py-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const product = item.product || {};

          return (
            <div
              key={item.product?._id || item._id}
              className="flex items-center gap-4 p-4 bg-white shadow rounded-xl"
            >
              {/* ✅ image */}
              <img
                src={
                  product.images?.[0]?.url ||
                  "/placeholder.png"
                }
                alt={product.name || "Product"}
                className="object-cover w-20 h-20 rounded"
              />

              {/* ✅ info */}
              <div className="flex-1">
                <h3 className="font-semibold">
                  {product.name || "Product"}
                </h3>

                <p className="text-gray-600">
                  ₹
                  {Number(
                    product.price || item.price || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>

              {/* ✅ quantity */}
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const qty = Math.max(
                    1,
                    Number(e.target.value)
                  );
                  updateQuantity?.(product._id, qty);
                }}
                className="w-16 p-1 border rounded"
              />

              {/* ✅ remove */}
              <button
                onClick={() =>
                  removeFromCart?.(product._id)
                }
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {/* ✅ total */}
      <div className="mt-6 text-right">
        <p className="mb-4 text-xl font-semibold">
          Total: ₹
          {Number(total).toLocaleString("en-IN")}
        </p>

        <Link
          to="/checkout"
          className="px-6 py-3 text-white bg-black rounded-xl hover:bg-gray-800"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default CartPage;