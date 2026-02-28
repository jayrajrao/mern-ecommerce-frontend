import { api } from "./api";

// ✅ REGISTER
export const registerUser = async (data) => {
  const res = await api.post("/user/register", data);
  return res.data;
};

// ✅ LOGIN
export const loginUser = async (data) => {
  const res = await api.post("/user/login", data);
  return res.data;
};

// ✅ LOGOUT
export const logoutUser = async () => {
  const res = await api.post("/user/logout");
  return res.data;
};