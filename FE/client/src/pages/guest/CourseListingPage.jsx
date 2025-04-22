import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { getFields } from "../../services/field.services";
import { FiBookmark, FiClock, FiStar } from "react-icons/fi";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../components/common/LoadingPage";
import { useCourse } from "../../contexts/CourseContext";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const isNewCourse = () => {
    const createdDate = dayjs(course.createdAt.split(" ")[0]); // VD: 2025-04-16
    const today = dayjs(); // ngày hiện tại
    const diffInDays = today.diff(createdDate, "day"); // số ngày chênh lệch
    return diffInDays <= 7; // nếu số ngày chênh lệch <= 7 thì là khóa học mới
  };

  if (!course.active || course.status !== "APPROVED") return null;

  return (
    <motion.div
      key={course.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: course.id * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 max-w-4xl mx-auto"
      onClick={() => {
        navigate(`/courses/${course.fields[0].id}/${course.id}`);
      }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/3">
          <img
            src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${course.id}/${
              course.image
            }`}
            alt={course.title}
            className="w-full h-48 md:h-full object-cover"
            loading="lazy"
          />
          {isNewCourse() && (
            <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-md text-sm font-medium">
              New
            </div>
          )}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-muted transition-colors duration-200"
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <FiBookmark
              className={`${isBookmarked ? "fill-primary" : ""} text-primary`}
            />
          </button>
        </div>

        <div className="p-4 md:w-2/3">
          <h3 className="text-lg font-bold text-foreground mb-2">
            {course.title}
          </h3>
          <p className="text-accent mb-3">{course.owner.fullName}</p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <FiClock className="text-accent mr-1" />
              <span className="text-sm text-accent">{"12 weeks"}</span>
            </div>
            <div className="flex items-center">
              <FiStar className="text-chart-4 mr-1" />
              <span className="text-sm text-accent">
                {course.overallRating}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ${course.price.toFixed(2)}
            </span>
            <span className="text-sm px-2 py-1 bg-muted rounded-full text-accent">
              {course.fields[0].name}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CourseListingPage = () => {
  const { courses, isLoadingCourses } = useCourse();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    priceRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getFields();
      setCategories(response.result);
    };

    fetchCategories();
  }, []);
  if (isLoadingCourses) {
    return <LoadingPage />;
  }

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

  return (
    <div className="bg-background px-4 md:px-8 min-h-[500px]">
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
                <div className="min-h-screen bg-background p-6">
                  <div className="max-w-7xl mx-auto">
                    <motion.div layout className="space-y-6">
                      {filteredCourses.map((course) => (
                        <CourseCard
                          // key={course.id}
                          course={course}
                          // cart={cartItems}
                          // addToCart={addToCart}
                          // myOrders={orders}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
                // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                //   {filteredCourses.map((course) => (
                //     <CourseCard
                //       // key={course.id}
                //       course={course}
                //       // cart={cartItems}
                //       // addToCart={addToCart}
                //       // myOrders={orders}
                //     />
                //   ))}
                // </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseListingPage;
