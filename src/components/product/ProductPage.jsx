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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProductById(id);
        setProduct(data);
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
    if (adding) return;

    try {
      setAdding(true);
      await addCartItem(product._id, 1);
      await fetchCart();
      toast.success("Added to cart 🛒");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Image */}
          <div className="w-full overflow-hidden bg-white shadow-sm rounded-2xl">
            <img
              src={product.images?.[0]?.url || "/placeholder.png"}
              alt={product.name}
              className="object-cover w-full h-64 sm:h-80 md:h-[420px]"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              {product.name}
            </h1>

            <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              {product.description}
            </p>

            <p className="mb-2 text-xl font-semibold text-green-600 sm:text-2xl">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <p className="mb-6 text-sm text-gray-500">
              Rating: {product.rating || "N/A"}
            </p>

            <button
              disabled={adding}
              onClick={handleAddToCart}
              className="w-full px-6 py-3 text-white transition bg-black sm:w-fit rounded-xl hover:bg-gray-800 disabled:opacity-50"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;