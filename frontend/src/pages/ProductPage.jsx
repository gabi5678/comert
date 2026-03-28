import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../context/CartContext";
import StockBadge from "../components/StockBadge";
import ProductInfoTabs from "../components/ProductInfoTabs";
import ProductReviews from "../components/ProductReviews";

export default function ProductPage() {
  const { id } = useParams();
  const { product, productLoading, productError } = useProduct(id);
  const { addToCart } = useCart();

  const gallery = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return ["https://via.placeholder.com/600x700?text=Product"];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(0);

  if (productLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="animate-pulse rounded-[32px] bg-white p-6 shadow-lg">
            <div className="h-[520px] rounded-[24px] bg-gray-200" />
          </div>
          <div className="animate-pulse rounded-[32px] bg-white p-6 shadow-lg">
            <div className="mb-4 h-6 w-24 rounded bg-gray-200" />
            <div className="mb-4 h-10 w-2/3 rounded bg-gray-200" />
            <div className="mb-4 h-5 w-1/3 rounded bg-gray-200" />
            <div className="mb-6 h-20 w-full rounded bg-gray-200" />
            <div className="h-12 w-full rounded-full bg-gray-200" />
          </div>
        </div>
      </section>
    );
  }

  if (productError || !product) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-[28px] bg-white p-10 text-center shadow-lg">
          <h1 className="mb-3 text-3xl font-black text-gray-900">
            Product not found
          </h1>
          <p className="text-gray-500">
            {productError || "This product could not be loaded."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[32px] bg-white p-6 shadow-lg">
          <div className="mb-4 overflow-hidden rounded-[24px] bg-pink-50">
            <img
              src={gallery[selectedImage]}
              alt={product.name}
              className="h-[520px] w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {gallery.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-2xl border-2 transition ${
                  selectedImage === index
                    ? "border-pink-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name}-${index}`}
                  className="h-24 w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-lg">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">
            {product.brand || "Beauty"}
          </p>

          <h1 className="mb-4 text-4xl font-black leading-tight text-gray-900">
            {product.name}
          </h1>

          <div className="mb-4 text-3xl font-black text-pink-600">
            {product.price} RON
          </div>

          <div className="mb-6">
            <StockBadge stock={product.stock} />
          </div>

          <p className="mb-6 text-gray-600">
            {product.description || "Premium beauty product designed to enhance your routine."}
          </p>

          {Array.isArray(product.skinType) && product.skinType.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-semibold text-gray-900">Skin type</p>
              <div className="flex flex-wrap gap-2">
                {product.skinType.map((type) => (
                  <span
                    key={type}
                    className="rounded-full bg-pink-50 px-3 py-1 text-sm font-medium text-pink-600"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(product.shades) && product.shades.length > 0 && (
            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold text-gray-900">Shades</p>
              <div className="flex flex-wrap gap-2">
                {product.shades.map((shade) => (
                  <span
                    key={shade}
                    className="rounded-full border border-pink-200 px-3 py-1 text-sm font-medium text-gray-700"
                  >
                    {shade}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => addToCart(product.id, 1)}
            disabled={Number(product.stock || 0) <= 0}
            className="w-full rounded-full bg-pink-600 py-4 text-base font-semibold text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {Number(product.stock || 0) > 0 ? "Add to Cart" : "Out of stock"}
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <ProductInfoTabs product={product} />
        <ProductReviews />
      </div>
    </section>
  );
}