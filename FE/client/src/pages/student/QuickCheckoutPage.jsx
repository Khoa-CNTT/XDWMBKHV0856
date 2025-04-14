import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaPaypal,
  FaUniversity,
  FaApplePay,
  FaGooglePay,
} from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { useParams } from "react-router-dom";
import { getCourseById } from "../../services/course.services";
import { createOrder } from "../../services/order.services";
import { toast } from "react-toastify";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

const QuickCheckoutPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { removeFromCart } = useCart();
  const [course, setCourse] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      const response = await getCourseById(courseId);
      setCourse(response);
    };

    fetchCourse();
  }, []);

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

  const handleCheckout = async () => {
    await createOrder({
      buyer: {
        id: user.id,
      },
      courses: [{ id: course.id }],
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
                src={course?.image}
                alt="Course Thumbnail"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-heading text-foreground mb-2">
                {course?.title}
              </h2>
              <p className="text-accent mb-1">
                Instructor: {course?.owner.fullName}
              </p>
              <p className="text-accent mb-4">Duration: 12 weeks</p>
              <div className="flex items-center space-x-4">
                {/* <span className="text-destructive line-through">
                  ${courseData.originalPrice}
                </span> */}
                <span className="text-2xl font-heading text-primary">
                  ${course?.price}
                </span>
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

            {/* Order Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h3 className="font-heading text-foreground">Order Summary</h3>
              <div className="flex justify-between text-accent">
                <span>Course Price</span>
                <span>${course?.price}</span>
              </div>
              <div className="flex justify-between text-accent">
                <span>Estimated Tax</span>
                <span>${Math.round(course?.price * 0.1)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-heading text-foreground">
                  <span>Total</span>
                  <span>
                    ${course?.price + Math.round(course?.price * 0.1)}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-lg font-medium text-primary-foreground ${
                isValid ? "bg-primary" : "bg-accent cursor-not-allowed"
              }`}
              disabled={!isValid}
              onClick={handleCheckout}
            >
              Complete Purchase
            </motion.button>

            <div className="flex items-center justify-center space-x-2 text-accent text-sm">
              <MdCheckCircle className="text-chart-2" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickCheckoutPage;
