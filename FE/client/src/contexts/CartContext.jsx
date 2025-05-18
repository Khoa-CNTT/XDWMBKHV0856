import { createContext, useContext, useEffect, useState } from "react";
import {
  addToWishlist,
  getWishlistByUserId,
  removeFromWishlist,
} from "../services/wishlist.services";
import { useAuth } from "./AuthContext";
import { useMyOrder } from "./MyOrderContext";
import { toast } from "react-toastify";

// Tạo context
const CartContext = createContext();

// Provider để cung cấp trạng thái giỏ hàng cho các component khác
export const CartProvider = ({ children }) => {
  const { user, loadingUser } = useAuth();
  const { myOrders } = useMyOrder();
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart khi user thay đổi
  useEffect(() => {
    const fetchCart = async () => {
      if (loadingUser || !user) return;
      try {
        const cart = await getWishlistByUserId(user.id);
        if (cart && cart.courses) {
          setCartItems(cart.courses || []);
        }
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    };

    fetchCart();
  }, [loadingUser, user]);

  // Tự động xóa khóa học đã mua khỏi giỏ hàng
  useEffect(() => {
    if (!myOrders || !cartItems.length) return;

    // Lấy danh sách ID của các khóa học đã mua
    const purchasedCourseIds = myOrders
      .filter((order) => order.status === "PAID")
      .map((order) => order.course.id);

    // Kiểm tra xem có khóa học nào trong giỏ hàng đã được mua chưa
    const purchasedItemsInCart = cartItems.filter((item) =>
      purchasedCourseIds.includes(item.id)
    );

    if (purchasedItemsInCart.length > 0) {
      // Lọc ra các khóa học chưa mua
      const updatedCart = cartItems.filter(
        (item) => !purchasedCourseIds.includes(item.id)
      );

      // Cập nhật giỏ hàng
      setCartItems(updatedCart);

      // Xóa các khóa học đã mua khỏi wishlist trong database
      const removePurchasedCourses = async () => {
        try {
          for (const item of purchasedItemsInCart) {
            await removeFromWishlist({
              courseId: Number(item.id),
              wishlistId: Number(user.id),
            });
          }
        } catch (error) {
          console.error("Lỗi khi xóa khóa học đã mua khỏi giỏ hàng:", error);
        }
      };

      removePurchasedCourses();
    }
  }, [myOrders, cartItems, user]);

  // Hàm thêm item vào cart
  const addToCart = async (courseId) => {
    if (!user) return;

    // Kiểm tra xem khóa học đã được mua chưa
    const isPurchased = myOrders?.some(
      (order) => order.course.id === Number(courseId) && order.status === "PAID"
    );

    if (isPurchased) {
      toast.info("You have already purchased this course!");
      return;
    }

    // Kiểm tra xem khóa học đã có trong giỏ hàng chưa
    const isInCart = cartItems.some((item) => item.id === Number(courseId));
    if (isInCart) {
      toast.info("This course is already in your cart!");
      return;
    }

    try {
      const response = await addToWishlist({
        courseId: Number(courseId),
        wishlistId: Number(user.id),
      });

      if (response && response.data) {
        const updatedCart = response.data.data?.courses || [];
        setCartItems(updatedCart);
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
        const updatedCart = response.data.data?.courses || [];
        setCartItems(updatedCart);
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
