import { createContext, useContext, useEffect, useState } from "react";

// Tạo context
const CartContext = createContext();

// Provider để cung cấp trạng thái giỏ hàng cho các component khác
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart từ localStorage khi component mount
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  // Hàm thêm item vào cart
  const addToCart = (item) => {
    const updatedCart = [...cartItems, item];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart); // Cập nhật state để re-render
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart); // Cập nhật state để re-render
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useCart = () => useContext(CartContext);
