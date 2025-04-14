import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCcStripe,
  FaCcPaypal,
  FaTrash,
  FaUniversity,
  FaUser,
} from "react-icons/fa";
import { SiPaypal } from "react-icons/si";
import { toast } from "react-toastify";
import { createOrder } from "../../services/order.services";
import { useAuth } from "../../contexts/AuthContext";

const CheckoutPage = () => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCartItems(JSON.parse(cart));
    }
  }, []);

  const paymentMethods = [
    { id: "stripe", name: "Stripe", icon: <FaCcStripe size={24} /> },
    { id: "vnpay", name: "VNPay", icon: <SiPaypal size={24} /> },
    { id: "paypal", name: "PayPal", icon: <FaCcPaypal size={24} /> },
    { id: "bank", name: "Bank Transfer", icon: <FaUniversity size={24} /> },
  ];

  const totalPrice = cartItems.reduce(
    (total, course) => total + course.price,
    0
  );

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    localStorage.setItem(
      "cart",
      JSON.stringify(cartItems.filter((item) => item.id !== id))
    );
  };

  const handleCheckout = async () => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    await createOrder({
      buyer: {
        id: user.id,
      },
      courses: cartItems.map((item) => {
        return {
          id: item.id,
        };
      }),
    });

    toast.success("Order successfully", {
      autoClose: 1000,
      onClose: () => {
        window.location.href = "/payment/success";
      },
    });
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
              {cartItems.map((item) => (
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
                          <span>{item.owner.email}</span>
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
                      {/* <p className="text-muted-foreground">{item.duration}</p> */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-primary font-semibold">
                          ${item.price}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
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
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              <div className="space-y-4 mb-6">
                {paymentMethods.map((method) => (
                  <motion.label
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedPayment === method.id
                        ? "border-primary bg-primary bg-opacity-5"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    {method.icon}
                    <span className="text-foreground">{method.name}</span>
                  </motion.label>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-primary text-primary-foreground mt-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                disabled={cartItems.length === 0 || !selectedPayment}
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
