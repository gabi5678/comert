export default function StockBadge({ stock }) {
  const inStock = Number(stock || 0) > 0;

  return (
    <div
      className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
        inStock
          ? "bg-emerald-100 text-emerald-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {inStock ? `In stock` : "Out of stock"}
    </div>
  );
}