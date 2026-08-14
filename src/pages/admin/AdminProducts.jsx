import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPendingProducts, updateProductStatus } from "../../services/admin.service";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // track which product is being acted on

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getPendingProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      setActionLoading(id);
      await updateProductStatus(id, status);
      toast.success(`Product ${status}`);
      // remove from list immediately (optimistic-ish)
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="p-8">Loading pending products...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-bold">Pending Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No pending products right now 🎉</p>
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
                <p className="text-sm text-gray-500">
                  Vendor: {product.vendor?.name || "N/A"}{" "}
                  {product.vendor?.businessName && `(${product.vendor.businessName})`}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={actionLoading === product._id}
                  onClick={() => handleStatusUpdate(product._id, "approved")}
                  className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  disabled={actionLoading === product._id}
                  onClick={() => handleStatusUpdate(product._id, "rejected")}
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;