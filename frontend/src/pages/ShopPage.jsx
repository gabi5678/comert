import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { useCategories } from "../hooks/useCategories";
import ProductCard from "../components/ProductCard";
import ShopFilters from "../components/ShopFilters";

export default function ShopPage() {
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("categoryId") || ""
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [onlyFeatured, setOnlyFeatured] = useState(
    searchParams.get("featured") === "true"
  );

  const queryObject = useMemo(() => {
    const query = {
      isActive: "true",
    };

    if (selectedCategory) query.categoryId = selectedCategory;
    if (search.trim()) query.search = search.trim();
    if (onlyFeatured) query.featured = "true";

    return query;
  }, [selectedCategory, search, onlyFeatured]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products", { params: queryObject });
      setProducts(res.data);
    } catch (error) {
      console.error("Eroare la produse:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [queryObject]);

  const handleApplyFilters = () => {
    const params = {};

    if (selectedCategory) params.categoryId = selectedCategory;
    if (search.trim()) params.search = search.trim();
    if (onlyFeatured) params.featured = "true";

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSearch("");
    setOnlyFeatured(false);
    setSearchParams({});
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 rounded-[36px] bg-gradient-to-r from-pink-300 via-pink-200 to-rose-200 px-8 py-12 shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pink-700">
          Beauty Collection
        </p>
        <h1 className="mb-3 text-4xl font-black text-gray-900 md:text-5xl">
          Discover Our Makeup Collection
        </h1>
        <p className="max-w-2xl text-gray-700">
          Explore premium beauty products, trending essentials și produse potrivite
          pentru rutina ta.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ShopFilters
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          search={search}
          setSearch={setSearch}
          onlyFeatured={onlyFeatured}
          setOnlyFeatured={setOnlyFeatured}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">Products</h2>
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${products.length} results`}
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[28px] bg-white p-4 shadow-md"
                >
                  <div className="mb-4 h-64 rounded-[24px] bg-gray-200" />
                  <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                  <div className="mb-2 h-5 w-2/3 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[28px] bg-white p-10 text-center shadow-lg">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                No products found
              </h3>
              <p className="text-gray-500">
                Încearcă alte filtre sau resetează căutarea.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}