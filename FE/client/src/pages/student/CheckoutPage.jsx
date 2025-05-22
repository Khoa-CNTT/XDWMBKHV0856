import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaCreditCard, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { payosMultipleCheckout } from "../../services/payment.services";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const CheckoutPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const { user } = useAuth();

  // Calculate total price from cart items array
  const totalPrice =
    cartItems?.reduce((total, course) => total + course.price, 0) || 0;

  const handleRemoveItem = async (id) => {
    await removeFromCart(id);
  };

  const handleCheckout = async () => {
    if (!cartItems?.length) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const paymentData = {
        buyer: {
          id: user.id,
        },
        courses: cartItems.map((item) => ({
          id: item.id,
        })),
      };

      const response = await payosMultipleCheckout(paymentData);

      if (response?.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error("Failed to create payment session");
        console.error("Payment session creation failed:", response);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message || "Payment failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-heading font-heading text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence>
              {cartItems?.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card rounded-lg p-4 mb-4 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full md:w-48 h-32 object-cover rounded-md"
                      loading="lazy"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <FaUser />
                          <span>{item.owner.fullName}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.skills.map((skill) => (
                            <span
                              key={skill.id}
                              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-primary font-semibold">
                          {item.price.toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-destructive hover:text-opacity-80 transition-colors"
                      aria-label="Remove item"
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-sm sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FaCreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                  <p className="text-sm text-muted-foreground">
                    Secure payment with credit card
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-foreground">
                    {totalPrice.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className={`w-full mt-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  !cartItems?.length
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                }`}
                disabled={!cartItems?.length}
              >
                {!cartItems?.length ? "Cart is Empty" : "Pay Now"}
              </motion.button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                By clicking "Pay Now", you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
