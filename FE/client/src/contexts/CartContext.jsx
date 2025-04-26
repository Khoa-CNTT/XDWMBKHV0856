import { createContext, useContext, useEffect, useState } from "react";
import {
  addToWishlist,
  getWishlistByUserId,
  removeFromWishlist,
} from "../services/wishlist.services";
import { useAuth } from "./AuthContext";

// Tạo context
const CartContext = createContext();

// Provider để cung cấp trạng thái giỏ hàng cho các component khác
export const CartProvider = ({ children }) => {
  const { user, loadingUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      if (loadingUser || !user) return;
      try {
        const cart = await getWishlistByUserId(user.id);
        setCartItems(cart || []);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    };

    fetchCart();
  }, [loadingUser, user]); // lắng nghe khi user hoặc loadingUser thay đổi

  // Hàm thêm item vào cart
  const addToCart = async (courseId) => {
    if (!user) return;
    try {
      const response = await addToWishlist({
        courseId: Number(courseId),
        wishlistId: Number(user.id),
      });

      if (response && response.data) {
        setCartItems(response.data.data || []);
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  const removeFromCart = async (courseId) => {
    if (!user) return;
    try {
      const response = await removeFromWishlist({
        courseId: Number(courseId),
        wishlistId: Number(user.id),
      });

      if (response && response.data) {
        setCartItems(response.data.data || []);
      }
    } catch (error) {
      console.error("Lỗi khi xóa khỏi giỏ hàng:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useCart = () => useContext(CartContext);
