import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, profile, logout } = useAuth();
  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-3xl font-black tracking-tight text-pink-600"
        >
          GLOWIFY
        </Link>

      <nav className="hidden items-center gap-8 md:flex">

  {profile?.role === "customer" && (
    <>
      <Link to="/" className="text-sm font-medium hover:text-pink-600">
        Home
      </Link>

      <Link to="/shop" className="text-sm font-medium hover:text-pink-600">
        Shop
      </Link>

      <Link to="/cart" className="text-sm font-medium hover:text-pink-600">
        Cart ({cartCount})
      </Link>

      <Link to="/recommender" className="text-sm font-medium hover:text-pink-600">
        Recommender
      </Link>
    </>
  )}

  {profile?.role === "admin" && (
    <>
      <Link to="/admin" className="text-sm font-medium hover:text-pink-600">
        Admin
      </Link>
   
    </>
  )}

  {!user ? (
    <Link to="/login" className="text-sm font-medium hover:text-pink-600">
      Login
    </Link>
  ) : (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600">
        {user.displayName || user.email}
      </span>

      <button
        onClick={logout}
        className="rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500"
      >
        Logout
      </button>
    </div>
  )}
</nav>
      </div>
    </header>
  );
}
