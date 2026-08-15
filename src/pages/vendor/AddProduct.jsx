import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getCategories, createProduct } from "../../services/vendor.service";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

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

    if (!imageFile) {
      toast.error("Product image is required");
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
      fd.append("images", imageFile);

      const data = await createProduct(fd);

      if (!data.success) {
        toast.error(data.message || "Failed to add product");
        return;
      }

      toast.success(
        data.product?.status === "approved"
          ? "Product added"
          : "Product submitted — pending admin approval"
      );

      navigate("/vendor/my-products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-semibold">Add Product</h1>

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
          disabled={loadingCategories}
          required
        >
          <option value="">
            {loadingCategories ? "Loading categories..." : "Select category"}
          </option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="object-cover w-32 h-32 border rounded-md"
          />
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 text-white bg-black rounded-md"
        >
          {submitting ? "Submitting..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;