import http from "../config/http";

export const getUserCoupons = async (userId) => {
  try {
    const response = await http.get(`/user-coupon/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user coupons:", error);
    throw error;
  }
};

export const getCouponId = async (couponId) => {
  try {
    const response = await http.get(`/coupon/${couponId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user coupons:", error);
    throw error;
  }
};
