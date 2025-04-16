import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import Cart from "./Cart";
import User from "./User";
import { useAuth } from "../../../contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    "Web Development",
    "Design",
    "Marketing",
    "Programming Languages",
    "Data Science",
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
              <Cart
                toggleDropdown={toggleDropdown}
                activeDropdown={activeDropdown}
              />

              {user && (
                <Link
                  to={"/student/learning-dashboard"}
                  className="hidden lg:block  dark:text-white bg-primary text-white rounded-md px-4 py-2 hover:bg-opacity-70 transition duration-300"
                >
                  Get Started
                </Link>
              )}

              <User />
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
