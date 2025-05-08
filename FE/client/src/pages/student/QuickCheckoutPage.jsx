import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaPaypal,
  FaUniversity,
  FaApplePay,
  FaGooglePay,
  FaTag,
  FaClock,
  FaFileAlt,
  FaUserGraduate,
  FaCheck,
} from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { useParams } from "react-router-dom";
import { createOrder } from "../../services/order.services";
import { toast } from "react-toastify";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import useFetch from "../../hooks/useFetch";
import { getUserCoupons } from "../../services/coupon.services";

const QuickCheckoutPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { removeFromCart } = useCart();
  const { data: course } = useFetch(`/course-details/${courseId}`);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    getUserCoupons(user.id).then((res) => {
      setCoupons(res.data);
    });
  }, [user.id]);

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

  const paymentMethods = [
    { id: 1, name: "Credit Card", icon: FaCreditCard },
    { id: 2, name: "PayPal", icon: FaPaypal },
    { id: 3, name: "Bank Transfer", icon: FaUniversity },
    { id: 4, name: "Apple Pay", icon: FaApplePay },
    { id: 5, name: "Google Pay", icon: FaGooglePay },
  ];

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setIsValid(true);
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setIsCouponApplied(false);
  };

  // Calculate prices
  const coursePrice = course?.price || 0;
  const totalDiscount = couponDiscount;
  const finalTotal = coursePrice - totalDiscount;

  const handleCheckout = async () => {
    // Find the coupon object if one of the user's coupons is applied
    const selectedCoupon = isCouponApplied
      ? validCoupons.find(
          (item) =>
            item.coupon.headCode.toUpperCase() === couponCode.toUpperCase()
        )
      : null;

    await createOrder({
      buyer: {
        id: user.id,
      },
      courses: [{ id: course.id }],
      couponCode: isCouponApplied ? couponCode : null,
      couponId: selectedCoupon ? selectedCoupon.id : null,
      discount: totalDiscount,
    }).then(() => {
      removeFromCart(course.id);
      toast.success("Order successfully", {
        autoClose: 1000,
        onClose: () => {
          window.location.href = "/payment/success";
        },
      });
    });
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
            <h2 className="text-xl font-heading text-foreground">
              Select Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                    selectedMethod?.id === method.id
                      ? "border-primary bg-primary bg-opacity-10"
                      : "border-border hover:border-primary"
                  }`}
                  onClick={() => handleMethodSelect(method)}
                >
                  <div className="flex items-center space-x-3">
                    <method.icon className="text-2xl text-accent" />
                    <span className="font-medium text-foreground">
                      {method.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

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
                            <p className="font-medium">
                              {couponItem.coupon.headCode}
                            </p>
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
                                // For fixed amount coupons
                                if (
                                  couponItem.coupon.discountType === "FIXED"
                                ) {
                                  setCouponDiscount(couponItem.coupon.value);
                                }
                                // For percentage-based coupons
                                else if (
                                  couponItem.coupon.discountType === "PERCENT"
                                ) {
                                  const discount =
                                    coursePrice *
                                    (couponItem.coupon.value / 100);
                                  setCouponDiscount(Math.round(discount));
                                }
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
              className={`w-full p-4 font-bold text-white rounded-lg ${
                isValid
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isValid}
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
