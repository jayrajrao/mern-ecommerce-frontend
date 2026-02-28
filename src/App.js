import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import NavBar from "./tailwind/NavBar";
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from "./pages/Profile";
import Footer from "./tailwind/Footer";


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
