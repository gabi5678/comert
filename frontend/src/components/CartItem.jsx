export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <div className="grid gap-4 rounded-[28px] bg-white p-4 shadow-md md:grid-cols-[120px_1fr_auto] md:items-center">
      <img
        src={item.image || "https://via.placeholder.com/200x200?text=Product"}
        alt={item.name}
        className="h-28 w-full rounded-[20px] object-cover md:w-28"
      />

      <div>
        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.slug}</p>
        <p className="mt-2 text-lg font-black text-pink-600">
          {item.price} RON
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-end">
        <div className="flex items-center gap-3 rounded-full bg-pink-50 px-3 py-2">
          <button
            onClick={onDecrease}
            className="h-8 w-8 rounded-full bg-white text-lg font-bold text-pink-600 shadow hover:bg-pink-100"
          >
            -
          </button>

          <span className="min-w-[24px] text-center font-semibold">
            {item.quantity}
          </span>

          <button
            onClick={onIncrease}
            className="h-8 w-8 rounded-full bg-white text-lg font-bold text-pink-600 shadow hover:bg-pink-100"
          >
            +
          </button>
        </div>

        <button
          onClick={onRemove}
          className="text-sm font-semibold text-red-500 hover:text-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
}