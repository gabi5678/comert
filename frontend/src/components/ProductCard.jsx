import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "motion/react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="group rounded-[28px] bg-white p-4 shadow-md hover:shadow-2xl"
    >
      <Link to={`/product/${product.id}`}>
        <div className="overflow-hidden rounded-[24px]">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.35 }}
            src={product.images?.[0] || "https://via.placeholder.com/400x400?text=Product"}
            alt={product.name}
            className="mb-4 h-64 w-full object-cover"
          />
        </div>
      </Link>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-pink-500">
          {product.brand || "Beauty"}
        </p>

        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-lg font-bold text-gray-900 transition group-hover:text-pink-600">
            {product.name}
          </h3>
        </Link>

        <p className="line-clamp-2 min-h-[40px] text-sm text-gray-500">
          {product.description || "Premium beauty product."}
        </p>

        <div className="pt-2 text-xl font-black text-pink-600">
          {product.price} RON
        </div>
      </div>

      <button
        onClick={() => addToCart(product.id, 1)}
        className="mt-4 w-full rounded-full bg-pink-600 py-3 text-sm font-semibold text-white transition hover:bg-pink-500"
      >
        Add to Cart
      </button>
    </motion.div>
  );
}