import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-3xl font-black tracking-tight text-pink-600">
          GLOWIFY
        </Link>

        <nav className="hidden gap-8 md:flex">
          <Link to="/" className="text-sm font-medium hover:text-pink-600">Home</Link>
          <Link to="/shop" className="text-sm font-medium hover:text-pink-600">Shop</Link>
          <Link to="/cart" className="text-sm font-medium hover:text-pink-600">Cart</Link>
          <Link to="/login" className="text-sm font-medium hover:text-pink-600">Login</Link>
        </nav>
      </div>
    </header>
  );
}