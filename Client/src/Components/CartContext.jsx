// CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";

const Cartfromlocalstorage = JSON.parse(localStorage.getItem('cart') || "[]")

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      // Check if the item is already in the cart
      const existingItem = state.find((item) => item.id === action.payload.id);

      if (existingItem) {
        // If item exists, update quantity
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item is not in the cart, add it with quantity 1
        return [...state, { ...action.payload, quantity: 1 }];
      }

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload.id);

    case "ADD_TO_CART_PAGE":
      // Check if the item is already in the cart
      const existingcartItem = state.find(
        (item) => item.id === action.payload.id
      );

      if (existingcartItem !== -1) {
        // If item exists, update quantity
        return state.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );

      } else {
        // If item is not in the cart, add it with quantity 1
        return [...state, { ...action.payload, quantity: 1 }];//I don't need this, I fact do need this.
      }

    case "SUB_FROM_CART_PAGE":
      // Check if the item is already in the cart
      const existingItemIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex !== -1) {
        // If item exists, update quantity
        return state.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      else {

        return state;
      }

    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, Cartfromlocalstorage);

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(storedCart) });
    }
  }, []);

  // Save cart items to localStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);


  const addToCart = (item, quantity) => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_TO_CART", payload: item });
    }
  };

  //For Cart Page quantity selector
  const addToCartpage = (item) => {
    dispatch({ type: "ADD_TO_CART_PAGE", payload: item });
  };

  const subFromCartpage = (item) => {
    dispatch({ type: "SUB_FROM_CART_PAGE", payload: item });
  };

  const removeFromCart = (item) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  // Calculate total price of items in the cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Add tax and shipping charges
  const calculateTotalWithTaxAndShipping = () => {
    const subtotal = calculateTotal();
    const taxRate = 0.1; // 10% tax
    const shippingCost = 100; // Fixed shipping cost

    const tax = subtotal * taxRate;
    const total = subtotal + tax + shippingCost;

    return total.toFixed(2); // Round to 2 decimal places
  };

  const calculateTax = () => {
    const subtotal = calculateTotal();
    return (0.1 * subtotal).toFixed(2);
  };

  const calculateShipping = () => {
    const shippingCost = 100;
    const Totalitems = cart.reduce((total, item) => total + item.quantity, 0);
    return (shippingCost * Totalitems).toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        subFromCartpage,
        addToCart,
        addToCartpage,
        removeFromCart,
        calculateTotal,
        calculateTotalWithTaxAndShipping,
        calculateTax,
        calculateShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

export { CartProvider, useCart };
