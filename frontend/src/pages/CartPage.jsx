import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { Link } from "react-router-dom";

export default function CartPage() {
  const {
    cart,
    cartLoading,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
  } = useCart();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const total = cart?.total || 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (cartLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-black text-gray-900">My Cart</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-[28px] bg-white p-6 shadow-md"
              >
                <div className="h-28 rounded-[20px] bg-gray-200" />
              </div>
            ))}
          </div>

          <div className="animate-pulse rounded-[28px] bg-white p-6 shadow-md">
            <div className="mb-4 h-6 w-1/2 rounded bg-gray-200" />
            <div className="mb-3 h-4 w-full rounded bg-gray-200" />
            <div className="mb-3 h-4 w-full rounded bg-gray-200" />
            <div className="h-10 w-full rounded-full bg-gray-200" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 rounded-[36px] bg-gradient-to-r from-pink-300 via-pink-200 to-rose-200 px-8 py-12 shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pink-700">
          Your Beauty Bag
        </p>
        <h1 className="mb-3 text-4xl font-black text-gray-900 md:text-5xl">
          My Cart
        </h1>
        <p className="max-w-2xl text-gray-700">
          Review your products before checkout and complete your Glowify order.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[28px] bg-white p-12 text-center shadow-lg">
          <h2 className="mb-3 text-3xl font-black text-gray-900">
            Your cart is empty
          </h2>
          <p className="mb-6 text-gray-500">
            Explore our premium beauty collection and add your favorite products.
          </p>
          <Link
            to="/shop"
            className="inline-flex rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-500"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onIncrease={() =>
                  updateCartItemQuantity(item.productId, item.quantity + 1)
                }
                onDecrease={() =>
                  updateCartItemQuantity(item.productId, item.quantity - 1)
                }
                onRemove={() => removeCartItem(item.productId)}
              />
            ))}
          </div>

          <CartSummary
            subtotal={subtotal}
            total={total}
            itemCount={itemCount}
            onClearCart={clearCart}
          />
        </div>
      )}
    </section>
  );
}