import { api } from "./api";

// 🟢 vendor: get own products
export const getMyProducts = async () => {
  const res = await api.get("/products/vendor/mine");
  return res.data.products;
};

// 🟢 vendor: create product (multipart form-data because of image)
export const createProduct = async (formData) => {
  const res = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 🟢 vendor: update product
export const updateProduct = async (id, formData) => {
  const res = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// 🟢 vendor: delete product
export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

// 🟢 get categories (for dropdown in add-product form)
export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data.categories;
};