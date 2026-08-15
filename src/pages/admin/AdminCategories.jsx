import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/admin.service";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [actingId, setActingId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Category name required");
      return;
    }

    try {
      setCreating(true);
      await createCategory(newName.trim());
      toast.success("Category created");
      setNewName("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      setActingId(cat._id);
      await updateCategory(cat._id, { isActive: !cat.isActive });
      toast.success(cat.isActive ? "Category deactivated" : "Category activated");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? This only works if no products use it.")) return;

    try {
      setActingId(id);
      await deleteCategory(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete category — it may still be in use by products"
      );
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <div className="p-8">Loading categories...</div>;

  return (
    <div className="max-w-2xl p-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <Link to="/admin" className="text-sm text-gray-500 hover:text-black">
          ← Back to dashboard
        </Link>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <button
          type="submit"
          disabled={creating}
          className="px-4 py-2 text-white bg-black rounded-md disabled:opacity-50"
        >
          {creating ? "Adding..." : "Add"}
        </button>
      </form>

      {categories.length === 0 ? (
        <p className="text-gray-500">No categories yet.</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div>
                <p className="font-medium">{cat.name}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    cat.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(cat)}
                  disabled={actingId === cat._id}
                  className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  {cat.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  disabled={actingId === cat._id}
                  className="px-3 py-1.5 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
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
}

export default AdminCategories;