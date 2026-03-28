import { useState } from "react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function RecommenderPage() {
  const [formData, setFormData] = useState({
    productType: "",
    skinType: "",
    finish: "",
    maxPrice: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        productType: formData.productType,
        skinType: formData.skinType,
        finish: formData.finish,
        maxPrice: formData.maxPrice ? Number(formData.maxPrice) : undefined,
      };

      const res = await api.post("/recommender", payload);
      setResults(res.data.recommendations || []);
    } catch (error) {
      console.error(error);
      toast.error("Error recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 rounded-[36px] bg-gradient-to-r from-pink-300 via-pink-200 to-rose-200 px-8 py-12 shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pink-700">
          Personalized Beauty
        </p>
        <h1 className="mb-3 text-4xl font-black text-gray-900 md:text-5xl">
          Makeup Recommender
        </h1>
        <p className="max-w-2xl text-gray-700">
          Find the right product based on your skin type, finish preferences and budget.
        </p>
      </div>

      <div className="mb-10 rounded-[32px] bg-white p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            name="productType"
            placeholder="Product type (ex: fond de ten)"
            value={formData.productType}
            onChange={handleChange}
            className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
          />

          <input
            type="text"
            name="skinType"
            placeholder="Skin type (ex: gras)"
            value={formData.skinType}
            onChange={handleChange}
            className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
          />

          <input
            type="text"
            name="finish"
            placeholder="Finish (ex: matte)"
            value={formData.finish}
            onChange={handleChange}
            className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Max price"
            value={formData.maxPrice}
            onChange={handleChange}
            className="rounded-2xl border border-pink-100 px-4 py-3 outline-none focus:border-pink-400"
          />

          <div className="md:col-span-2 xl:col-span-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-pink-600 px-8 py-3 font-semibold text-white transition hover:bg-pink-500 disabled:opacity-60"
            >
              {loading ? "Searching..." : "Get Recommendations"}
            </button>
          </div>
        </form>
      </div>

      {results.length === 0 ? (
        <div className="rounded-[28px] bg-white p-10 text-center shadow-lg text-gray-500">
          No recommendations yet. Fill in the filters above.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}