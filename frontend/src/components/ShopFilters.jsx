export default function ShopFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
  onlyFeatured,
  setOnlyFeatured,
  onApply,
  onReset,
}) {
  return (
    <aside className="rounded-[28px] bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-black text-gray-900">Filters</h2>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Search
          </label>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none transition focus:border-pink-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-2xl border border-pink-100 px-4 py-3 outline-none transition focus:border-pink-400"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={onlyFeatured}
            onChange={(e) => setOnlyFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-pink-300 accent-pink-600"
          />
          Only featured products
        </label>

        <div className="grid gap-3">
          <button
            onClick={onApply}
            className="rounded-full bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-500"
          >
            Apply filters
          </button>

          <button
            onClick={onReset}
            className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
}