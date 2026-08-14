import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProduct, getCategories } from "../../services/vendor.service";

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, images: file }));
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.images) {
      toast.error("Please select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("category", form.category);
      formData.append("images", form.images);

      await createProduct(formData);

      toast.success("Product submitted for approval");
      navigate("/vendor");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg p-8 mx-auto">
      <h2 className="mb-6 text-2xl font-bold">Add New Product</h2>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded-lg shadow">
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-4">
          <input
            name="price"
            type="number"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} required />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="object-cover w-24 h-24 mt-2 rounded"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-white bg-black rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit for Approval"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;