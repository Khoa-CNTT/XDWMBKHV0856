import { toast } from "react-toastify";
import http from "../../config/http";

export const addToWishlist = async (data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const response = await http.post("/wishlist", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Added to cart successfully!", {
      autoClose: 1000,
    });
    return response;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
};

export const getWishlistByUserId = async (userId) => {
  try {
    const response = await http.get(`/wishlist/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  }
};

export const removeFromWishlist = async (data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const response = await http.patch("/wishlist", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Removed from cart successfully!", {
      autoClose: 1000,
    });

    return response;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
  }
};
