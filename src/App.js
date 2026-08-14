import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
<<<<<<< HEAD
import { AuthProvider } from "./context/AuthContext";
=======
>>>>>>> 214996eb39acd32bb05a118d58ed75eb0955c079
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import NavBar from "./tailwind/NavBar";
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from "./pages/Profile";
import Footer from "./tailwind/Footer";
<<<<<<< HEAD
import ProtectedRoute from "./components/ProtectedRoute";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";

// Vendor pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
import AddProduct from "./pages/vendor/AddProduct";
import Orders from "./pages/Orders";

function App() {
  return (
    <AuthProvider>
      <NavBar/>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />

        {/* Vendor routes */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={["vendor", "admin"]}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/add-product"
          element={
            <ProtectedRoute allowedRoles={["vendor", "admin"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
  path="/orders"
  element={
    <ProtectedRoute allowedRoles={["user", "vendor", "admin"]}>
      <Orders />
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
=======


function App() {
  return (
    <>
    <NavBar/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
     <Footer />   {/* ⭐ ADD HERE */}


     <Toaster position="top-right" />
    </>
  );
}

export default App;
>>>>>>> 214996eb39acd32bb05a118d58ed75eb0955c079
