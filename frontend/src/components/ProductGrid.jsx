import { useProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function ProductGrid() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">
              Best sellers
            </p>
            <h2 className="text-3xl font-black text-gray-900">Trending Products</h2>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-[28px] bg-white p-4 shadow-md"
            >
              <div className="mb-4 h-56 rounded-[24px] bg-gray-200"></div>
              <div className="h-4 w-2/3 rounded bg-gray-200"></div>
              <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">
            Best sellers
          </p>
          <h2 className="text-3xl font-black text-gray-900">Trending Products</h2>
        </div>

        <Link
          to="/shop"
          className="text-sm font-semibold text-pink-600 hover:text-pink-500"
        >
          Shop all
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <div
            key={product.id}
            className="group rounded-[28px] bg-white p-4 shadow-md transition hover:-translate-y-2 hover:shadow-xl"
          >
            <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-[24px]">
              <img
                src={product.images?.[0] || "https://via.placeholder.com/300"}
                alt={product.name}
                className="mb-4 h-56 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </Link>

            <p className="text-xs uppercase tracking-[0.2em] text-pink-500">
              {product.brand || "Beauty"}
            </p>

            <h3 className="mt-1 line-clamp-2 font-bold text-gray-900">
              {product.name}
            </h3>

            <p className="mt-1 text-sm text-gray-500">{product.brand}</p>

            <div className="mt-3 font-black text-pink-600">
              {product.price} RON
            </div>

            <button
              onClick={() => addToCart(product.id, 1)}
              className="mt-4 w-full rounded-full bg-pink-600 py-2.5 text-white transition hover:bg-pink-500"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}