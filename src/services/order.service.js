import { api } from "./api";

// 🟢 get logged-in user's orders
export const getMyOrders = async () => {
  const res = await api.get("/orders/my-orders");
  return res.data.orders;
};

// 🟢 get single order details
export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data.order;
};

// 🟢 request return
export const requestReturn = async (id, reason) => {
  const res = await api.post(`/orders/${id}/return`, { reason });
  return res.data;
};