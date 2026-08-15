// import { api } from "./api";

// // ===== Products =====
// export const getPendingProducts = async () => {
//   const res = await api.get("/products/admin/pending");
//   return res.data.products;
// };

// export const updateProductStatus = async (id, status) => {
//   const res = await api.patch(`/products/admin/${id}/status`, { status });
//   return res.data;
// };

// // ===== Categories =====
// export const getCategories = async () => {
//   const res = await api.get("/categories");
//   return res.data.categories;
// };

// export const createCategory = async (name) => {
//   const res = await api.post("/categories", { name });
//   return res.data;
// };

// export const deleteCategory = async (id) => {
//   const res = await api.delete(`/categories/${id}`);
//   return res.data;
// };

// // ===== Orders =====
// export const getAllOrders = async (filters = {}) => {
//   const params = new URLSearchParams(filters).toString();
//   const res = await api.get(`/orders/admin/all?${params}`);
//   return res.data.orders;
// };

// export const updateOrderStatus = async (id, orderStatus) => {
//   const res = await api.patch(`/orders/admin/${id}/status`, { orderStatus });
//   return res.data;
// };

// export const updateReturnStatus = async (id, returnStatus) => {
//   const res = await api.patch(`/orders/admin/${id}/return-status`, { returnStatus });
//   return res.data;
// };

import { api } from "./api";

// ===== Products =====
export const getPendingProducts = async () => {
  const res = await api.get("/products/admin/pending");
  return res.data.products;
};

export const updateProductStatus = async (id, status) => {
  const res = await api.patch(`/products/admin/${id}/status`, { status });
  return res.data;
};

// ===== Categories =====
export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data.categories;
};

export const createCategory = async (name) => {
  const res = await api.post("/categories", { name });
  return res.data;
};

export const updateCategory = async (id, payload) => {
  // payload can be { name } and/or { isActive }
  const res = await api.put(`/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

// ===== Orders =====
export const getAllOrders = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await api.get(`/orders/admin/all?${params}`);
  return res.data.orders;
};

export const updateOrderStatus = async (id, orderStatus) => {
  const res = await api.patch(`/orders/admin/${id}/status`, { orderStatus });
  return res.data;
};

export const updateReturnStatus = async (id, returnStatus) => {
  const res = await api.patch(`/orders/admin/${id}/return-status`, { returnStatus });
  return res.data;
};