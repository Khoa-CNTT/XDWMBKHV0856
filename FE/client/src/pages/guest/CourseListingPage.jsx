import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaSearch,
  FaFilter,
  FaTimes,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useCourseStore } from "../../store/useCourseStore";
import { getFields } from "../../services/field.services";
import { useOrderStore } from "../../store/useOrderStore";
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course, cart, addToCart, myOrders }) => {
  const rating = () => {
    if (course.reviews.length === 0) return 0;
    const totalRating = course.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    return (totalRating / course.reviews.length).toFixed(1);
  };

  const handleAddToCart = (course) => {
    if (cart.find((c) => c.id === course.id)) {
      return;
    }
    toast.success("Added to cart!", { autoClose: 1000 });
    addToCart(course);
  };

  // Kiểm tra nếu người dùng đã mua khóa học
  const alreadyBought = myOrders.some((order) => order.course.id === course.id);

  if (course.active === false) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
      onClick={() => (window.location.href = `/course/${course.id}`)}
    >
      <div className="relative pb-[60%]">
        <img
          src={course.image}
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <h3 className="text-lg font-heading text-foreground mb-2">
          {course.title}
        </h3>
        <div className="flex flex-col">
          <div className="flex items-center mb-2 text-sm text-accent">
            <FaUser className="mr-2" />
            <span>{course.owner.fullName}</span>
          </div>
          <p className="text-sm text-accent-foreground mb-3">
            {course.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaStar className="text-chart-4" />
              <span className="ml-1 text-sm text-accent">{rating()}</span>
            </div>
            <span className="font-bold text-primary">${course.price}</span>
          </div>

          {!alreadyBought ? (
            <div className="flex gap-2 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/student/checkout/${course.id}`;
                }}
                className="flex-1 text-center bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Checkout
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(course);
                }}
                className="bg-white text-primary py-3 px-4 rounded-lg font-medium hover:opacity-50 transition-colors border-2 border-primary"
              >
                <FaShoppingCart />
              </button>
            </div>
          ) : (
            <button
              className="bg-muted text-accent py-3 rounded-lg font-medium mt-2 cursor-not-allowed"
              disabled
            >
              Already Enrolled
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CourseListingPage = () => {
  const { courses } = useCourseStore();
  const { orders } = useOrderStore();
  const { addToCart, cartItems } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    priceRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.category === "all" ||
        course.fields.some(
          (field) => field.name.toLowerCase() === filters.category.toLowerCase()
        )) &&
      (filters.level === "all" || course.level === filters.level) &&
      (filters.priceRange === "all" ||
        (filters.priceRange === "free" && course.price === 0) ||
        (filters.priceRange === "paid" && course.price > 0))
    );
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getFields();
      setCategories(response.result);
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-background p-4 md:p-8 mt-16 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Section */}
          <motion.div
            className={`md:w-64 bg-card p-4 rounded-lg ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-heading">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden text-accent hover:text-accent-foreground"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  className="w-full p-2 border rounded-sm bg-muted"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select
                  className="w-full p-2 border rounded-sm bg-muted"
                  value={filters.level}
                  onChange={(e) =>
                    setFilters({ ...filters, level: e.target.value })
                  }
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <select
                  className="w-full p-2 border rounded-sm bg-muted"
                  value={filters.priceRange}
                  onChange={(e) =>
                    setFilters({ ...filters, priceRange: e.target.value })
                  }
                >
                  <option value="all">All Prices</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border rounded-sm bg-muted"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" />
              </div>
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden mt-4 flex items-center text-accent hover:text-accent-foreground"
              >
                <FaFilter className="mr-2" /> Show Filters
              </button>
            </div>

            <AnimatePresence>
              {filteredCourses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 text-accent"
                >
                  No courses found matching your criteria
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      cart={cartItems}
                      addToCart={addToCart}
                      myOrders={orders} // Truyền myOrders vào CourseCard
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseListingPage;
