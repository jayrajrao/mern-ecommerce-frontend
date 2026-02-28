import { api } from "./api";

// 🟢 get cart
export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

// 🟢 add item ✅ FIXED
export const addCartItem = async (productId, quantity = 1) => {
  const res = await api.post("/cart/add", {
    productId,
    quantity,
  });
  return res.data;
};

// 🟢 update qty ✅ FIXED
export const updateCartItem = async (productId, quantity) => {
  const res = await api.put("/cart/update", {
    productId,
    quantity,
  });
  return res.data;
};

// 🟢 remove item ✅ FIXED
export const removeCartItem = async (productId) => {
  const res = await api.delete(`/cart/remove/${productId}`);
  return res.data;
};

// 🟢 clear cart
export const clearCart = async () => {
  const res = await api.delete("/cart/clear");
  return res.data;
};