import { Link } from "react-router-dom";

export default function CartSummary({ subtotal, total, itemCount, onClearCart }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-black text-gray-900">Order Summary</h2>

      <div className="space-y-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{subtotal} RON</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>

        <div className="border-t border-pink-100 pt-4">
          <div className="flex items-center justify-between text-base font-bold text-gray-900">
            <span>Total</span>
            <span>{total} RON</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <Link
          to="/checkout"
          className="rounded-full bg-pink-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-pink-500"
        >
          Proceed to Checkout
        </Link>

        <button
          onClick={onClearCart}
          className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}