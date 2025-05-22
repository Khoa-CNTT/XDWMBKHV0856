import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiChevronDown, FiMenu, FiX, FiGrid } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Cart from "./Cart";
import User from "./User";
import { useAuth } from "../../../contexts/AuthContext";
import { getFields } from "../../../services/field.services";
import useClickOutside from "../../../hooks/useClickOutside";
import { Badge } from "../../ui/badge";

const Header = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await getFields();
        setCategories(response.result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
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
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-primary font-medium transition-colors duration-200 group"
              >
                <FiGrid className="w-4 h-4 group-hover:text-primary transition-colors" />
                <span>Categories</span>
                <FiChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "categories" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeDropdown === "categories" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Browse Categories
                      </h3>
                    </div>
                    <div className="max-h-[30vh] overflow-y-auto">
                      {isLoading ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          Loading categories...
                        </div>
                      ) : categories.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          No categories available
                        </div>
                      ) : (
                        categories.map((category) => (
                          <Link
                            to={`/courses?categories=${category.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/courses?categories=${category.id}`);
                              setActiveDropdown(null);
                            }}
                            key={category.id}
                            className="flex items-center justify-between px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors duration-150 group"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                {category.name}
                              </span>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                      <Link
                        to="/courses"
                        onClick={() => setActiveDropdown(null)}
                        className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        View all categories →
                      </Link>
                    </div>
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
