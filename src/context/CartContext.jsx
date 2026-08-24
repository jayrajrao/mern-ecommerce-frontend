// import { createContext, useContext, useEffect, useState } from "react";
// import {
//   getCart,
//   clearCart as clearCartApi,
//   removeCartItem,
//   updateCartItem,
//   addCartItem,
// } from "../services/cart.service";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   // ✅ fetch cart
//   const fetchCart = async () => {
//     try {
//       const res = await getCart();

//       console.log("FETCH CART RESPONSE:", res);

//       const items =
//         res?.cart?.items ||
//         res?.items ||
//         [];

//       setCartItems(items);
//     } catch (err) {
//       console.error("Cart fetch failed", err);
//       setCartItems([]);
//     }
//   };

//   // ✅ OPTIMISTIC ADD (⭐ PRO FEATURE)
//   const addToCartOptimistic = async (product, quantity = 1) => {
//     // ⭐ instant UI update
//     setCartItems((prev) => {
//       const existing = prev.find(
//         (i) =>
//           i.productId === product._id ||
//           i.productId?._id === product._id
//       );

//       if (existing) {
//         return prev.map((i) =>
//           i.productId === product._id ||
//           i.productId?._id === product._id
//             ? { ...i, quantity: i.quantity + quantity }
//             : i
//         );
//       }

//       return [
//         ...prev,
//         {
//           _id: product._id,
//           productId: product._id,
//           name: product.name,
//           price: product.price,
//           quantity,
//         },
//       ];
//     });

//     try {
//       // ⭐ real API call
//       await addCartItem(product._id, quantity);
//     } catch (err) {
//       console.error("Optimistic add failed, refetching...", err);
//       await fetchCart(); // rollback safety
//     }
//   };

//   // ✅ remove item
//   const removeFromCart = async (productId) => {
//     try {
//       await removeCartItem(productId);
//       await fetchCart();
//     } catch (err) {
//       console.error("Remove failed", err);
//     }
//   };

//   // ✅ update qty
//   const updateQuantity = async (productId, quantity) => {
//     try {
//       await updateCartItem(productId, quantity);
//       await fetchCart();
//     } catch (err) {
//       console.error("Update qty failed", err);
//     }
//   };

//   // ✅ clear cart
//   const clearCart = async () => {
//     try {
//       await clearCartApi();
//     } catch (err) {
//       console.error(err);
//     }
//     setCartItems([]);
//   };

//   // ⭐ fetch on login
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) fetchCart();
//     else setCartItems([]);
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         fetchCart,
//         clearCart,
//         removeFromCart,
//         updateQuantity,
//         addToCartOptimistic, // ⭐ IMPORTANT EXPORT
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);

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

  // fetch cart — backend returns items as { product: {_id, name, price, images}, quantity, price }
  const fetchCart = async () => {
    try {
      const res = await getCart();
      const items = res?.cart?.items || [];
      setCartItems(items);
    } catch (err) {
      setCartItems([]);
    }
  };

  // optimistic add — item shape here MUST match what fetchCart returns from the
  // backend (nested `product` object), otherwise the cart array ends up with
  // mixed shapes and anything reading item.name / item.product.name breaks
  // depending on whether that item came from a fetch or an optimistic add.
  const addToCartOptimistic = async (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product?._id === product._id);

      if (existing) {
        return prev.map((i) =>
          i.product?._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [
        ...prev,
        {
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images,
          },
          quantity,
          price: product.price,
        },
      ];
    });

    try {
      await addCartItem(product._id, quantity);
    } catch (err) {
      // rollback safety — resync with server truth
      await fetchCart();
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeCartItem(productId);
      await fetchCart();
    } catch (err) {
      // no-op — UI stays as-is, user can retry
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await updateCartItem(productId, quantity);
      await fetchCart();
    } catch (err) {
      // no-op — UI stays as-is, user can retry
    }
  };

  // clear cart — caller must ensure the auth token is still present when
  // this runs (see NavBar's handleLogout for why order matters)
  const clearCart = async () => {
    try {
      await clearCartApi();
    } catch (err) {
      // ignore — we still want local state cleared below
    }
    setCartItems([]);
  };

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
        addToCartOptimistic,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);