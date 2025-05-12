import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import Cart from "./Cart";
import User from "./User";
import { useAuth } from "../../../contexts/AuthContext";
import { getFields } from "../../../services/field.services";
import useClickOutside from "../../../hooks/useClickOutside";

const Header = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getFields();
      setCategories(response.result);
    };

    fetchCategories();
  }, []);

  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const categoriesRef = useClickOutside(() => {
    if (activeDropdown === "categories") {
      setActiveDropdown(null);
    }
  });

  return (
    <header className="fixed w-full top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to={"/"} className="text-2xl font-bold text-primary">
            {import.meta.env.VITE_APP_NAME || "V-Learning"}
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to={"/"}
              className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to={"/courses"}
              className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium transition-colors duration-200"
            >
              Courses
            </Link>
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => toggleDropdown("categories")}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-primary font-medium transition-colors duration-200"
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
                    className="absolute top-full mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 border border-gray-100 dark:border-gray-600"
                  >
                    {categories.map((category) => (
                      <Link
                        to={`/courses/${category.id}`}
                        onClick={() => setActiveDropdown(null)}
                        key={category.id}
                        className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-colors duration-150"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link
              to={"/about"}
              className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              to={"/contact"}
              className="text-gray-700 dark:text-gray-200 hover:text-primary font-medium transition-colors duration-200"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-5">
              <Cart
                toggleDropdown={toggleDropdown}
                activeDropdown={activeDropdown}
              />

              {user && (
                <Link
                  to={"/student/learning-dashboard"}
                  className="hidden lg:flex items-center justify-center h-10 bg-primary text-white rounded-full px-5 hover:bg-primary/90 transition-colors duration-200 font-medium"
                >
                  Start Learning
                </Link>
              )}

              <User />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-gray-700 dark:text-gray-200 p-1"
              aria-label="Toggle menu"
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
              className="lg:hidden mt-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-inner">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/courses"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                >
                  Courses
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg px-4 py-3 font-medium transition-colors duration-200"
                >
                  Contact
                </Link>
                {user && (
                  <Link
                    to="/student/learning-dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center bg-primary text-white hover:bg-primary/90 rounded-lg px-4 py-3 font-medium transition-colors duration-200 mt-2"
                  >
                    Start Learning
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
