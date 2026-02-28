import { api } from "./api";

// 🟢 create razorpay order
export const createRazorpayOrder = async (orderId) => {
  const res = await api.post("/payment/create-order", { orderId });
  return res.data;
};

// 🟢 create DB order (FIXED)
export const createOrder = async (payload) => {
  const res = await api.post("/orders/create", payload);
  return res.data;
};

// 🟢 verify payment
export const verifyRazorpayPayment = async (payload) => {
  const res = await api.post("/payment/verify", payload);
  return res.data;
};