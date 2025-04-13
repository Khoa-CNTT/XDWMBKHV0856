import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { FaTrash, FaShoppingBag } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../../../contexts/CartContext";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Cart = ({ toggleDropdown, activeDropdown }) => {
  const { cartItems, removeFromCart } = useCart();
  const { user } = useAuth();

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <FaShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
      <p className="text-sm text-accent mb-4">
        Explore courses to add to your cart!
      </p>
      <Link
        to="/courses"
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        Browse Courses
      </Link>
    </div>
  );

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="relative">
      <button
        onClick={() => toggleDropdown("cart")}
        className="relative text-foreground dark:text-white hover:text-primary"
      >
        <FiShoppingCart className="text-2xl" />
        {user && cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {activeDropdown === "cart" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg overflow-hidden border z-50"
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-heading text-center">My Cart</h2>
            </div>

            {!user ? (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  You're not logged in
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please log in to view your cart.
                </p>
                <Link
                  to="/login"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Log In
                </Link>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div>
                    <div className="p-2">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          className="flex items-center gap-3 p-3 hover:bg-secondary rounded-md transition-colors mb-2"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-md"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold truncate">
                              {item.title}
                            </h3>
                            <p className="text-xs text-accent truncate">
                              {item.owner.fullName}
                            </p>
                            <p className="text-sm font-semibold text-primary">
                              ${item.price}
                            </p>
                          </div>
                          <button
                            className="p-1.5 hover:bg-destructive hover:text-destructive-foreground rounded-full transition-colors"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove from cart"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-4 bg-secondary flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className="font-heading text-lg">
                          ${totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <Link
                        to="/student/checkout"
                        className="bg-primary text-center text-primary-foreground py-2 rounded hover:bg-opacity-90 transition-colors"
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
