import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token, user } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    total: 0,
  });
  const [cartLoading, setCartLoading] = useState(false);

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  const fetchCart = async () => {
    if (!token || !user) {
      setCart({ items: [], subtotal: 0, total: 0 });
      return;
    }

    try {
      setCartLoading(true);

      const res = await api.get("/cart", {
        headers: authHeaders,
      });

      setCart(res.data);
    } catch (error) {
      console.error("Eroare la preluarea coșului:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      alert("Trebuie să fii logat ca să adaugi produse în coș.");
      return;
    }

    try {
      await api.post(
        "/cart/add",
        { productId, quantity },
        {
          headers: authHeaders,
        }
      );

      await fetchCart();
      alert("Produs adăugat în coș");
    } catch (error) {
      console.error("Eroare add to cart:", error);
      alert(error?.response?.data?.message || "Eroare la adăugarea în coș");
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (!token) return;

    try {
      await api.put(
        `/cart/item/${productId}`,
        { quantity },
        {
          headers: authHeaders,
        }
      );

      await fetchCart();
    } catch (error) {
      console.error("Eroare update cantitate:", error);
      alert(error?.response?.data?.message || "Eroare la actualizarea cantității");
    }
  };

  const removeCartItem = async (productId) => {
    if (!token) return;

    try {
      await api.delete(`/cart/item/${productId}`, {
        headers: authHeaders,
      });

      await fetchCart();
    } catch (error) {
      console.error("Eroare remove item:", error);
      alert(error?.response?.data?.message || "Eroare la ștergerea produsului");
    }
  };

  const clearCart = async () => {
    if (!token) return;

    try {
      await api.delete("/cart/clear", {
        headers: authHeaders,
      });

      await fetchCart();
    } catch (error) {
      console.error("Eroare clear cart:", error);
      alert(error?.response?.data?.message || "Eroare la golirea coșului");
    }
  };

  const checkout = async (shippingAddress) => {
    if (!token) {
      throw new Error("Trebuie să fii logat pentru checkout.");
    }

    const res = await api.post(
      "/orders/checkout",
      { shippingAddress },
      {
        headers: authHeaders,
      }
    );

    await fetchCart();
    return res.data;
  };

  useEffect(() => {
    fetchCart();
  }, [token, user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        fetchCart,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}