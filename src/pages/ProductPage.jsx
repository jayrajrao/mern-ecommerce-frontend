import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/product.service";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ⭐ SINGLE clean hook
  const { addToCartOptimistic } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ Add to cart (OPTIMISTIC)
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);
      await addToCartOptimistic(product, qty);
      toast.success("Added to cart 🛒");
    } catch (err) {
      console.error("ADD CART ERROR:", err);
      toast.error("Add to cart failed");
    } finally {
      setAdding(false);
    }
  };

  // ✅ Buy now (OPTIMISTIC)
  const handleBuyNow = async () => {
    if (!product) return;

    try {
      setAdding(true);
      await addToCartOptimistic(product, qty);
      navigate("/checkout");
    } catch (err) {
      console.error("BUY NOW ERROR:", err);
      toast.error("Buy now failed");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return <p className="py-10 text-center">Product not found</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid max-w-6xl gap-8 px-4 py-6 mx-auto md:grid-cols-2">
        {/* image */}
      <img
  src={product.images?.url || "https://via.placeholder.com/400"}
  alt={product.name}
  className="w-full h-64 sm:h-80 md:h-[420px] object-cover rounded-2xl"
/>

        {/* info */}
        <div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
            {product.name}
          </h1>

          <p className="mb-4 text-gray-600">{product.description}</p>

          <p className="mb-6 text-2xl font-semibold text-green-600">
            ₹{product.price}
          </p>

          {/* quantity */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setQty((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded-lg"
            >
              −
            </button>

            <span className="text-lg font-semibold">{qty}</span>

            <button
              onClick={() => setQty((p) => p + 1)}
              className="px-3 py-1 border rounded-lg"
            >
              +
            </button>
          </div>

          {/* buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full px-6 py-3 text-white bg-black rounded-xl hover:bg-gray-800 disabled:opacity-50 sm:w-fit"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={adding}
              className="w-full px-6 py-3 text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 sm:w-fit"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;