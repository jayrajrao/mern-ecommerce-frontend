import { useEffect, useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import { getLatestProducts } from "../../services/product.service";

function ProductList({ filters }) { // ⭐ IMPORTANT
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⭐ refetch when filters change


const fetchProducts = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getLatestProducts(filters);
    setProducts(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Products error:", err);
    setError("Failed to load products");
  } finally {
    setLoading(false);
  }
}, [filters]);


useEffect(() => {
  fetchProducts();
}, [fetchProducts]);
  // ✅ skeleton loading
  if (loading) {
    return (
      <div className="px-4 py-6 mx-auto max-w-7xl">
        <h2 className="mb-6 text-2xl font-bold">
          Latest Products
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-10 font-medium text-center text-red-500">
        {error}
      </p>
    );
  }

  if (!products.length) {
    return (
      <p className="py-10 text-center text-gray-500">
        No products found.
      </p>
    );
  }

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl">
      <h2 className="mb-6 text-2xl font-bold">
        Latest Products
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;