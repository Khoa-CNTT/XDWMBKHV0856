import { createContext, useContext, useEffect, useState } from "react";
import { getUserCoupons } from "../services/coupon.services";
import { useAuth } from "./AuthContext";

const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCoupons = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await getUserCoupons(user?.id);
      let couponData = [];

      if (response.data && Array.isArray(response.data)) {
        couponData = response.data;
      } else if (response.result && Array.isArray(response.result)) {
        couponData = response.result;
      } else if (Array.isArray(response)) {
        couponData = response;
      } else {
        console.warn("Unexpected response structure:", response);
        // No longer using sample data as a fallback
        couponData = [];
      }

      setCoupons(couponData);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [user]);

  return (
    <CouponContext.Provider value={{ coupons, isLoading }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => useContext(CouponContext);
