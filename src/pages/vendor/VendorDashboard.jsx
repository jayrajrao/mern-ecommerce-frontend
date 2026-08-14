import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyProducts, deleteProduct } from "../../services/vendor.service";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getMyProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="p-8">Loading your products...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Products</h2>
        <Link
          to="/vendor/add-product"
          className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">You haven't added any products yet.</p>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow"
            >
              <img
                src={product.images?.[0]?.url || "/placeholder.png"}
                alt={product.name}
                className="object-cover w-20 h-20 rounded"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  ₹{product.price} • Stock: {product.stock}
                </p>
                <p className="text-sm text-gray-500">
                  Category: {product.category?.name || "N/A"}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs rounded ${statusColors[product.status]}`}
                >
                  {product.status}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/vendor/edit-product/${product._id}`}
                  className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;