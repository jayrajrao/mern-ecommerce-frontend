import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductById } from "../../services/product.service";
import { getCategories, updateProduct } from "../../services/vendor.service";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [existingImage, setExistingImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [product, cats] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);

        if (!product) {
          toast.error("Product not found");
          navigate("/vendor/my-products");
          return;
        }

        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          stock: product.stock ?? "",
          category: product.category?._id || product.category || "",
        });
        setExistingImage(product.images?.[0]?.url || null);
        setCategories(cats || []);
      } catch (err) {
        toast.error("Failed to load product");
        navigate("/vendor/my-products");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      toast.error("Name, price and category are required");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("stock", form.stock || 0);
      fd.append("category", form.category);
      if (imageFile) {
        fd.append("images", imageFile);
      }

      const data = await updateProduct(id, fd);

      if (!data.success) {
        toast.error(data.message || "Failed to update product");
        return;
      }

      toast.success("Product updated");
      navigate("/vendor/my-products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading product...</div>;

  return (
    <div className="max-w-xl px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-semibold">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div>
          <label className="block mb-1 text-sm text-gray-600">
            Current image
          </label>
          <img
            src={preview || existingImage || "/placeholder.png"}
            alt="Product"
            className="object-cover w-32 h-32 mb-2 border rounded-md"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <p className="mt-1 text-xs text-gray-400">
            Leave empty to keep the current image
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 text-white bg-black rounded-md disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;