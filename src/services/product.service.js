import { api } from "./api";

// ⭐ UPDATED — filter aware
export const getLatestProducts = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.category) params.append("category", filters.category);
  if (filters.sort) params.append("sort", filters.sort);

  const response = await api.get(`/products?${params.toString()}`);
  return response.data.products;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data.product;
};