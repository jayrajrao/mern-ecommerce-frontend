import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { logoutUser } from "../services/auth.service";
import { api } from "../services/api";
import toast from "react-hot-toast";

function NavBar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // ⭐ cart count
  const cartCount = useMemo(() => {
    return (cartItems || []).reduce(
      (acc, item) => acc + Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  const displayCount = cartCount > 99 ? "99+" : cartCount;

  // ===== FETCH PROFILE =====
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;
        const res = await api.get("/user/profile");
        setUser(res.data?.user || null);
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };

    fetchProfile();
  }, [token]);

  // ===== LOGOUT =====
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("token");
    clearCart?.();
    setUser(null);

    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-md bg-slate-900/90 border-slate-800">
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl">
        
        {/* ===== BRAND ===== */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-wide text-white transition hover:opacity-90"
        >
           UrbanDrip
        </Link>

        {/* ===== RIGHT ===== */}
        <div className="flex items-center gap-5">
          
          {/* CART */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative p-1 text-xl text-white transition hover:scale-110"
          >
            🛒

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 min-w-[20px] text-center bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold shadow-md">
                {displayCount}
              </span>
            )}
          </Link>

          {/* PROFILE / LOGIN */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              
              {/* avatar */}
              <div
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center flex-shrink-0 text-sm font-semibold text-white transition rounded-full cursor-pointer w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                title={user?.name || "Profile"}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm font-medium text-white transition rounded-lg bg-rose-600 hover:bg-rose-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm font-medium text-white transition rounded-lg bg-emerald-600 hover:bg-emerald-700"
            >
              Login
            </Link>
          )}

          {/* MOBILE BTN */}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-white rounded md:hidden hover:bg-slate-800"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {open && (
        <div className="px-4 pb-4 border-t md:hidden border-slate-800 bg-slate-900/95 backdrop-blur">
          <Link
            to="/"
            className="block py-2 text-gray-300 hover:text-white"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="block py-2 text-gray-300 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="block w-full py-2 text-left text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block py-2 text-gray-300 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;