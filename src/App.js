import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import NavBar from "./tailwind/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Footer from "./tailwind/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./pages/vendor/AddProduct";

function App() {
  return (
    <AuthProvider>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Vendor-only */}
        <Route
          path="/vendor/add-product"
          element={
            <ProtectedRoute allowedRoles={["vendor", "admin"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;