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
  const hasFilters = search || selectedCategory || onlyFeatured;

  return (
    <aside className="self-start rounded-[32px] bg-white p-6 shadow-lg lg:sticky lg:top-24">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500">
            Shop
          </p>
          <h2 className="mt-2 text-2xl font-black text-gray-900">Filters</h2>
        </div>

        {hasFilters && (
          <button
            onClick={onReset}
            className="text-sm font-semibold text-pink-600 hover:text-pink-500"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Search
          </label>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-pink-100 bg-pink-50/40 px-4 py-3 outline-none transition focus:border-pink-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-2xl border border-pink-100 bg-pink-50/40 px-4 py-3 outline-none transition focus:border-pink-400 focus:bg-white"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-pink-50/40 p-4">
          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={onlyFeatured}
              onChange={(e) => setOnlyFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-pink-300 accent-pink-600"
            />
            Show only featured products
          </label>
        </div>

        {hasFilters && (
          <div className="flex flex-wrap gap-2">
            {search && (
              <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                Search: {search}
              </span>
            )}

            {selectedCategory && (
              <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                Category selected
              </span>
            )}

            {onlyFeatured && (
              <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                Featured only
              </span>
            )}
          </div>
        )}

        <div className="grid gap-3 pt-2">
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