import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/product.service";
import { addCartItem } from "../services/cart.service";
import { useCart } from "../context/CartContext";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

function ProductPage() {
  const { id } = useParams();
  const { fetchCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProductById(id);
        setProduct(data?.product || data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (adding || !product) return;

    try {
      setAdding(true);
      await addCartItem(product._id, qty);
      await fetchCart();
      toast.success("Added to cart 🛒");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const increaseQty = () => {
    setQty((prev) => Math.min(product.stock || 10, prev + 1));
  };

  const decreaseQty = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <p className="py-10 font-medium text-center text-red-500">
        {error}
      </p>
    );
  }

  if (!product) {
    return (
      <p className="py-10 text-center text-gray-500">
        Product not found
      </p>
    );
  }

  const imageUrl = product.images?.[0]?.url || "/placeholder.png";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          
          {/* IMAGE */}
          <div className="overflow-hidden bg-white shadow-sm rounded-2xl">
            <img
              src={imageUrl}
              alt={product.name}
              className="object-cover w-full h-72 sm:h-96 md:h-[460px]"
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col justify-center">
            
            {/* name */}
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              {product.name}
            </h1>

            {/* rating */}
            <p className="mb-2 text-sm text-yellow-500">
              ⭐ {product.rating || 4.2}
            </p>

            {/* price */}
            <p className="mb-2 text-2xl font-bold text-green-600">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            {/* stock status */}
            {product.stock > 5 && (
              <p className="mb-4 text-sm text-green-600">In Stock</p>
            )}

            {product.stock > 0 && product.stock <= 5 && (
              <p className="mb-4 text-sm text-orange-500">
                Only {product.stock} left
              </p>
            )}

            {product.stock === 0 && (
              <p className="mb-4 text-sm text-red-500">Out of Stock</p>
            )}

            {/* description */}
            <p className="mb-6 leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* quantity */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={decreaseQty}
                className="px-3 py-1 border rounded-lg"
              >
                −
              </button>

              <span className="font-semibold">{qty}</span>

              <button
                onClick={increaseQty}
                className="px-3 py-1 border rounded-lg"
              >
                +
              </button>
            </div>

            {/* buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                disabled={adding || product.stock === 0}
                onClick={handleAddToCart}
                className="w-full px-6 py-3 text-white bg-black rounded-xl hover:bg-gray-800 disabled:opacity-50 sm:w-fit"
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>

              <button
                disabled={product.stock === 0}
                className="w-full px-6 py-3 text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 sm:w-fit"
              >
                Buy Now
              </button>
            </div>

            {/* delivery info */}
            <p className="mt-6 text-sm text-gray-500">
              🚚 Free delivery in 3–5 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;