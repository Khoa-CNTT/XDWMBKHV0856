import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTag,
  FaClock,
  FaFileAlt,
  FaUserGraduate,
  FaCheck,
} from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import useFetch from "../../hooks/useFetch";
import { getUserCoupons } from "../../services/coupon.services";
import { payosSingleCheckout } from "../../services/payment.services";

const QuickCheckoutPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { data: course } = useFetch(`/course-details/${courseId}`);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    getUserCoupons(user.id).then((res) => {
      // Group coupons by headCode
      const groupedCoupons = res.data.reduce((acc, couponItem) => {
        const key = couponItem.coupon.headCode;
        if (!acc[key]) {
          acc[key] = {
            ...couponItem,
            count: 1,
            // Keep the latest expiry date (closest to expiration)
            expiresAt: couponItem.expiresAt,
          };
        } else {
          acc[key].count += 1;
          // Update expiry date if this one is later (closer to expiration)
          const currentExpiry = new Date(acc[key].expiresAt);
          const newExpiry = new Date(couponItem.expiresAt);
          if (newExpiry > currentExpiry) {
            acc[key].expiresAt = couponItem.expiresAt;
          }
        }
        return acc;
      }, {});

      // Convert grouped object back to array
      setCoupons(Object.values(groupedCoupons));
    });
  }, [user.id]);
  console.log(coupons);

  // Filter out expired coupons
  const validCoupons =
    coupons && coupons.length > 0
      ? coupons.filter((couponItem) => {
          if (!couponItem.expiresAt) return true;

          // Parse date properly
          try {
            // Format: "2025-05-16 21:02:02 PM"
            const dateStr = couponItem.expiresAt;

            // Remove "PM" or "AM" and handle date parsing manually
            const cleanDateStr = dateStr.replace(" PM", "").replace(" AM", "");

            // Parse manually to ensure correct format
            const datePart = cleanDateStr.split(" ")[0];
            const [year, month, day] = datePart
              .split("-")
              .map((num) => parseInt(num, 10));

            // Create date (month in JS is 0-indexed)
            const expiryDate = new Date(year, month - 1, day);
            const now = new Date();

            const isValid = expiryDate > now;
            return isValid;
          } catch (err) {
            console.error("Error parsing date:", err);
            // If we can't parse the date, assume it's still valid
            return true;
          }
        })
      : [];

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setIsCouponApplied(false);
  };

  // Calculate prices
  const coursePrice = course?.price || 0;
  const totalDiscount = Math.min(couponDiscount, coursePrice); // Ensure total discount doesn't exceed course price
  const finalTotal = Math.max(0, coursePrice - totalDiscount); // Ensure final total is never negative

  const handleCheckout = async () => {
    try {
      // Find the coupon object if one of the user's coupons is applied
      const selectedCoupon = isCouponApplied
        ? validCoupons.find(
            (item) =>
              item.coupon.headCode.toUpperCase() === couponCode.toUpperCase()
          )
        : null;

      const paymentData = {
        buyer: {
          id: user.id,
        },
        course: {
          id: course.id,
        },
        userCoupon: selectedCoupon
          ? {
              id: selectedCoupon.id,
            }
          : null,
      };

      const response = await payosSingleCheckout(paymentData);

      // Handle successful payment response
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-8 mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-card rounded-lg shadow-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Course Details Section */}
          <div className="space-y-6">
            <h1 className="text-2xl font-heading text-foreground">Checkout</h1>
            <div className="bg-muted rounded-lg p-4">
              <img
                src={
                  course?.image
                    ? `${import.meta.env.VITE_COURSE_IMAGE_URL}/${course.id}/${
                        course.image
                      }`
                    : "https://via.placeholder.com/800x450?text=Course+Image"
                }
                alt="Course Thumbnail"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-heading text-foreground mb-2">
                {course?.title || "Course Title"}
              </h2>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-accent">
                  <FaUserGraduate className="text-primary" />
                  <p>
                    Instructor: {course?.owner?.fullName || "Instructor Name"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-accent">
                  <FaClock className="text-primary" />
                  <p>Created: {course?.createdAt.split(" ")[0]}</p>
                </div>
                <div className="flex items-center gap-2 text-accent">
                  <FaFileAlt className="text-primary" />
                  <p>Lectures: {course?.totalLecture || 0}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-2xl font-heading text-primary">
                  {course?.price?.toLocaleString("vi-VN") || 0} VNĐ
                </span>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-2">What You'll Get:</h3>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span>Access on mobile and desktop</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Methods Section */}
          <div className="space-y-6">
            {/* Coupon Code Section */}
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-heading text-foreground mb-3">
                Your Coupons
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                <span className="inline-flex items-center">
                  <MdCheckCircle className="mr-1 text-primary" />
                  Only one coupon can be applied per course
                </span>
              </p>

              {validCoupons.length > 0 ? (
                <div className="space-y-3">
                  {validCoupons.map((couponItem) => (
                    <div
                      key={couponItem.id}
                      className="p-3 border rounded-md bg-white"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-start gap-2">
                          <FaTag className="text-primary mt-1" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {couponItem.coupon.headCode}
                              </p>
                              {couponItem.count > 1 && (
                                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                  x{couponItem.count}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {couponItem.coupon.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Expires: {couponItem.expiresAt.split(" ")[0]}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="font-bold text-primary">
                            {couponItem.coupon.discountType === "FIXED"
                              ? `${couponItem.coupon.value.toLocaleString(
                                  "vi-VN"
                                )} VNĐ`
                              : `${couponItem.coupon.value}%`}
                          </span>

                          {isCouponApplied &&
                          couponCode === couponItem.coupon.headCode ? (
                            <button
                              onClick={removeCoupon}
                              className="text-red-500 border border-red-200 rounded-md px-3 py-1 text-sm font-medium hover:bg-red-50"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setCouponCode(couponItem.coupon.headCode);
                                let calculatedDiscount = 0;
                                // For fixed amount coupons
                                if (
                                  couponItem.coupon.discountType === "FIXED"
                                ) {
                                  // Ensure discount doesn't exceed course price
                                  calculatedDiscount = Math.min(
                                    couponItem.coupon.value,
                                    coursePrice
                                  );
                                }
                                // For percentage-based coupons
                                else if (
                                  couponItem.coupon.discountType === "PERCENT"
                                ) {
                                  const discount =
                                    coursePrice *
                                    (couponItem.coupon.value / 100);
                                  calculatedDiscount = Math.round(discount);
                                }
                                setCouponDiscount(calculatedDiscount);
                                setIsCouponApplied(true);
                                toast.success("Coupon applied successfully!");
                              }}
                              className={`rounded-md px-3 py-1 text-sm font-medium ${
                                isCouponApplied &&
                                couponCode !== couponItem.coupon.headCode
                                  ? "text-gray-400 border border-gray-200 cursor-not-allowed"
                                  : "text-primary border border-primary hover:bg-primary/10"
                              }`}
                              disabled={
                                isCouponApplied &&
                                couponCode !== couponItem.coupon.headCode
                              }
                            >
                              {isCouponApplied &&
                              couponCode !== couponItem.coupon.headCode
                                ? "Only one coupon allowed"
                                : "Apply"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>You don't have any coupons available</p>
                </div>
              )}

              {isCouponApplied && (
                <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <FaCheck className="text-green-500" />
                    <span className="font-medium">
                      Coupon{" "}
                      <span className="uppercase font-bold">{couponCode}</span>{" "}
                      applied!
                      <span className="ml-1 text-green-600">
                        (Discount: {couponDiscount.toLocaleString("vi-VN")} VNĐ)
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h3 className="font-heading text-foreground">Order Summary</h3>
              <div className="flex justify-between text-accent">
                <span>Course Price</span>
                <span>{coursePrice.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{couponDiscount.toLocaleString("vi-VN")} VNĐ</span>
                </div>
              )}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-heading text-foreground">
                  <span>Total</span>
                  <span className="text-xl font-bold text-primary">
                    {finalTotal.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 font-bold text-white rounded-lg bg-primary hover:bg-primary/90`}
              onClick={handleCheckout}
            >
              Complete Purchase
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickCheckoutPage;
