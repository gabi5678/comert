import { useProducts } from "../hooks/useProducts";

export default function ProductGrid() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-8 text-3xl font-bold">Trending Products</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-3xl bg-white p-4 shadow-md"
            >
              <div className="mb-4 h-48 rounded-2xl bg-gray-200"></div>
              <div className="h-4 w-2/3 bg-gray-200"></div>
              <div className="mt-2 h-4 w-1/2 bg-gray-200"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-8 text-3xl font-bold">Trending Products</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="group rounded-3xl bg-white p-4 shadow-md transition hover:-translate-y-2 hover:shadow-xl"
          >
            <img
              src={product.images?.[0] || "https://via.placeholder.com/300"}
              alt={product.name}
              className="mb-4 h-48 w-full rounded-2xl object-cover"
            />

            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.brand}</p>

            <div className="mt-2 font-bold text-pink-600">
              {product.price} RON
            </div>

            <button className="mt-4 w-full rounded-full bg-pink-600 py-2 text-white transition hover:bg-pink-500">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}