import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/product.service";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCartOptimistic } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  // 🔥 fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data?.product || null);
      } catch (err) {
        console.error("FETCH PRODUCT ERROR:", err);
        toast.error("Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ BULLETPROOF image resolver
  const imageUrl = useMemo(() => {
    if (!product) return "/placeholder.png";

    const img = product.images;

    // case 1: object
    if (img && typeof img === "object" && img.url) {
      return img.url;
    }

    // case 2: array
    if (Array.isArray(img) && img[0]?.url) {
      return img[0].url;
    }

    // case 3: string
    if (typeof img === "string") {
      return img;
    }

    return "/placeholder.png";
  }, [product]);

  // 🔍 DEBUG (SAFE PLACE)
  useEffect(() => {
    if (product) {
      console.log("🧪 PRODUCT:", product);
      console.log("🧪 RESOLVED IMAGE URL:", imageUrl);
    }
  }, [product, imageUrl]);

  // qty handlers
  const increaseQty = () => {
    if (!product) return;
    setQty((prev) => Math.min(product.stock || 10, prev + 1));
  };

  const decreaseQty = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  // Add to cart
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

  // Buy now
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
  if (!product)
    return <p className="py-10 text-center">Product not found</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid max-w-6xl gap-8 px-4 py-6 mx-auto md:grid-cols-2">
        {/* 🖼 image */}
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="object-cover w-full h-64 rounded-xl"
          onError={(e) => {
            console.error("❌ IMAGE LOAD FAILED:", e.currentTarget.src);

            if (e.currentTarget.src.includes("placeholder.png")) return;
            e.currentTarget.src = "/placeholder.png";
          }}
        />

        {/* 📦 info */}
        <div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
            {product.name}
          </h1>

          <p className="mb-4 text-gray-600">{product.description}</p>

          <p className="mb-6 text-2xl font-semibold text-green-600">
            ₹{product.price}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={decreaseQty}
              className="px-3 py-1 border rounded-lg"
            >
              −
            </button>

            <span className="text-lg font-semibold">{qty}</span>

            <button
              onClick={increaseQty}
              className="px-3 py-1 border rounded-lg"
            >
              +
            </button>
          </div>

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