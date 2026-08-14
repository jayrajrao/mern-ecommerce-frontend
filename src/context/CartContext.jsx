import { createContext, useContext, useEffect, useState } from "react";
import {
  getCart,
  clearCart as clearCartApi,
  removeCartItem,
  updateCartItem,
  addCartItem,
} from "../services/cart.service";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ fetch cart
  const fetchCart = async () => {
    try {
      const res = await getCart();

      console.log("FETCH CART RESPONSE:", res);

      const items =
        res?.cart?.items ||
        res?.items ||
        [];

      setCartItems(items);
    } catch (err) {
      console.error("Cart fetch failed", err);
      setCartItems([]);
    }
  };

  // ✅ OPTIMISTIC ADD (⭐ PRO FEATURE)
  const addToCartOptimistic = async (product, quantity = 1) => {
    // ⭐ instant UI update
    setCartItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === product._id ||
          i.productId?._id === product._id
      );

      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ||
          i.productId?._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [
        ...prev,
        {
          _id: product._id,
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
        },
      ];
    });

    try {
      // ⭐ real API call
      await addCartItem(product._id, quantity);
    } catch (err) {
      console.error("Optimistic add failed, refetching...", err);
      await fetchCart(); // rollback safety
    }
  };

  // ✅ remove item
  const removeFromCart = async (productId) => {
    try {
      await removeCartItem(productId);
      await fetchCart();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  // ✅ update qty
  const updateQuantity = async (productId, quantity) => {
    try {
      await updateCartItem(productId, quantity);
      await fetchCart();
    } catch (err) {
      console.error("Update qty failed", err);
    }
  };

  // ✅ clear cart
  const clearCart = async () => {
    try {
      await clearCartApi();
    } catch (err) {
      console.error(err);
    }
    setCartItems([]);
  };

  // ⭐ fetch on login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchCart();
    else setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCart,
        clearCart,
        removeFromCart,
        updateQuantity,
        addToCartOptimistic, // ⭐ IMPORTANT EXPORT
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);