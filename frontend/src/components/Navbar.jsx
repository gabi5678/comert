import { Link } from "react-router-dom";
import { House, ShoppingBag, ShoppingCart, Sparkles, ClipboardList, Shield, LogIn, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, profile, logout } = useAuth();

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const isAdmin = profile?.role === "admin";
  const isCustomer = user && profile?.role !== "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="text-3xl font-black tracking-tight text-pink-600"
        >
          GLOWIFY
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {!isAdmin && (
            <>
              <Link
                to="/"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-pink-600"
              >
                <House size={18} />
                Home
              </Link>

              <Link
                to="/shop"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-pink-600"
              >
                <ShoppingBag size={18} />
                Shop
              </Link>

              <Link
                to="/recommender"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-pink-600"
              >
                <Sparkles size={18} />
                Recommender
              </Link>
            </>
          )}

          {isCustomer && (
            <>
              <Link
                to="/cart"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-pink-600"
              >
                <ShoppingCart size={18} />
                Cart
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-bold text-pink-600">
                  {cartCount}
                </span>
              </Link>

              <Link
                to="/my-orders"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-pink-600"
              >
                <ClipboardList size={18} />
                My Orders
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-pink-600"
            >
              <Shield size={18} />
              Admin
            </Link>
          )}

          {!user ? (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-500"
            >
              <LogIn size={18} />
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              {!isAdmin && (
                <span className="text-sm font-medium text-gray-600">
                  {user.displayName || user.email}
                </span>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-500"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}