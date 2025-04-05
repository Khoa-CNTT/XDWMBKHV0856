import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiChevronDown,
  FiGlobe,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";

const Header = () => {
  const { user, handleLogout, isLoadingLogout } = useAuthStore();
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isOpenUserDropdown, setIsOpenUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartItems);
    setCartCount(cartItems.length);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const menuItems = [
    { icon: <FiSettings className="w-5 h-5" />, label: "Account Settings" },
    { icon: <FiGlobe className="w-5 h-5" />, label: "Language" },
    { icon: <FiHelpCircle className="w-5 h-5" />, label: "Help & Support" },
    { icon: <FiLogOut className="w-5 h-5" />, label: "Logout" },
  ];

  const categories = [
    "Web Development",
    "Design",
    "Marketing",
    "Programming Languages",
    "Data Science",
  ];

  const notifications = [
    { id: 1, message: "New course update available", isUnread: true },
    { id: 2, message: "Purchase confirmed", isUnread: true },
    { id: 3, message: "Learning milestone achieved", isUnread: true },
  ];

  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-card dark:bg-gray-800 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to={"/"} className="text-2xl font-bold text-primary">
            {import.meta.env.VITE_APP_NAME}
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to={"/"}
              className="text-foreground dark:text-white hover:text-primary"
            >
              Home
            </Link>
            <Link
              to={"/courses"}
              className="text-foreground dark:text-white hover:text-primary"
            >
              Courses
            </Link>
            <div className="relative">
              <button
                onClick={() => toggleDropdown("categories")}
                className="flex items-center space-x-1 text-foreground dark:text-white hover:text-primary"
              >
                <span>Categories</span>
                <FiChevronDown />
              </button>
              <AnimatePresence>
                {activeDropdown === "categories" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-48 bg-card dark:bg-gray-700 rounded-md shadow-lg py-2"
                  >
                    {categories.map((category) => (
                      <button
                        key={category}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground dark:text-white hover:bg-primary hover:text-white"
                      >
                        {category}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link
              to={"/about"}
              className="text-foreground dark:text-white hover:text-primary"
            >
              About Us
            </Link>
            <Link
              to={"/contact"}
              className="text-foreground dark:text-white hover:text-primary"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("cart")}
                  className="relative text-foreground dark:text-white hover:text-primary"
                >
                  <FiShoppingCart className="text-2xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {activeDropdown === "cart" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-card dark:bg-gray-700 rounded-md shadow-lg py-4"
                    >
                      <div className="px-4">
                        {user && cart.length > 0 ? (
                          cart.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center py-2"
                            >
                              <span className="text-sm text-foreground dark:text-white">
                                {item.title}
                              </span>
                              <span className="text-sm font-semibold text-foreground dark:text-white">
                                ${item.price}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="py-2 text-center text-sm text-foreground dark:text-white">
                            Your cart is empty
                          </div>
                        )}
                        <div className="mt-4 pt-4 border-t border-border dark:border-gray-600">
                          <button
                            onClick={() =>
                              (window.location.href = "/student/checkout")
                            }
                            className="w-full bg-primary text-white rounded-md py-2 hover:bg-opacity-90"
                          >
                            Checkout
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("notifications")}
                  className="relative text-foreground dark:text-white hover:text-primary"
                >
                  <FiBell className="text-2xl" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {activeDropdown === "notifications" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-card dark:bg-gray-700 rounded-md shadow-lg py-4"
                    >
                      <div className="px-4">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="py-2 border-b border-border dark:border-gray-600 last:border-0"
                          >
                            <p className="text-sm text-foreground dark:text-white">
                              {notification.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpenUserDropdown(!isOpenUserDropdown)}
                    aria-label="User menu"
                    aria-expanded={isOpenUserDropdown}
                    aria-haspopup="true"
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={`${import.meta.env.VITE_AVATAR_URL}/${user.id}/${
                        user.avatar
                      }`}
                      alt="User Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>
                  <AnimatePresence>
                    {isOpenUserDropdown && (
                      <>
                        <div
                          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                          role="button"
                          onClick={() => setIsOpenUserDropdown(false)}
                        />
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-64 rounded-lg bg-card shadow-lg border border-border z-50"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          <div className="p-4 border-b border-border">
                            <div className="flex items-center space-x-3">
                              <img
                                src={`${import.meta.env.VITE_AVATAR_URL}/${
                                  user.id
                                }/${user.avatar}`}
                                alt="User profile"
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-heading text-foreground">
                                  {user.fullName}
                                </h3>
                                <p className="text-sm text-accent">
                                  {user.email}
                                </p>
                                <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                                  {user.role}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-2">
                            {menuItems.map((item, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoadingLogout}
                                onClick={() => {
                                  if (item.label === "Logout") handleLogout();
                                  if (item.label === "Account Settings")
                                    window.location.href = "/student/account";
                                }}
                                className={`${
                                  isLoadingLogout ? "cursor-not-allowed" : ""
                                } flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-muted text-foreground transition-colors`}
                                role="menuitem"
                              >
                                <span className="mr-3 text-accent">
                                  {item.icon}
                                </span>
                                {item.label}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                >
                  Sign In
                </button>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-foreground dark:text-white"
            >
              {isOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <FiMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4"
            >
              <div className="flex flex-col space-y-4">
                <a
                  href="#"
                  className="text-foreground dark:text-white hover:bg-primary hover:text-white rounded-md px-4 py-2"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-foreground dark:text-white hover:bg-primary hover:text-white rounded-md px-4 py-2"
                >
                  Courses
                </a>
                {categories.map((category) => (
                  <button
                    key={category}
                    className="text-left px-4 py-2 text-foreground dark:text-white hover:bg-primary hover:text-white rounded-md"
                  >
                    {category}
                  </button>
                ))}
                <a
                  href="#"
                  className="text-foreground dark:text-white hover:bg-primary hover:text-white rounded-md px-4 py-2"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="text-foreground dark:text-white hover:bg-primary hover:text-white rounded-md px-4 py-2"
                >
                  Contact
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
