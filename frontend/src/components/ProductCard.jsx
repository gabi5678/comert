import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="group rounded-[30px] bg-white p-4 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-[24px] bg-pink-50">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="pt-4">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-pink-500">
          {product.brand || "Beauty"}
        </p>

        <h3 className="line-clamp-2 min-h-[64px] text-2xl font-black leading-tight text-gray-900">
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-3 min-h-[72px] text-sm leading-6 text-gray-500">
          {product.description || "Premium beauty product."}
        </p>

        <div className="mt-4 text-2xl font-black text-pink-600">
          {product.price} RON
        </div>

        <button
          onClick={() => addToCart(product.id, 1)}
          className="mt-5 w-full rounded-full bg-pink-600 py-3 text-sm font-semibold text-white transition hover:bg-pink-500"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}