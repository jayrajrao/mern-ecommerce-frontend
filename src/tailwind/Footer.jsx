import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 text-gray-300 bg-slate-900">
      <div className="px-4 py-12 mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* ===== Brand ===== */}
          <div>
            <h2 className="mb-3 text-xl font-bold text-white">
              🛍️ Shop
            </h2>
            <p className="text-sm text-gray-400">
              Your trusted ecommerce store for quality
              products at the best prices.
            </p>
          </div>

          {/* ===== Quick Links ===== */}
          <div>
            <h3 className="mb-3 font-semibold text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-2 text-sm">
              <Link
                to="/"
                className="hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/cart"
                className="hover:text-white"
              >
                Cart
              </Link>

              <Link
                to="/login"
                className="hover:text-white"
              >
                Login
              </Link>
            </div>
          </div>

          {/* ===== Contact ===== */}
          <div>
            <h3 className="mb-3 font-semibold text-white">
              Contact
            </h3>

            <p className="text-sm text-gray-400">
              Email: support@shop.com
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Mumbai, India
            </p>
          </div>
        </div>

        {/* ===== Bottom Bar ===== */}
        <div className="pt-6 mt-10 text-sm text-center text-gray-500 border-t border-slate-800">
          © {new Date().getFullYear()} Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;