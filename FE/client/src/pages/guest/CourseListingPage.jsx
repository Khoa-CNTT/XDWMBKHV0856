import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaStar,
} from "react-icons/fa";
import { FiClock, FiStar } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import LoadingPage from "../../components/common/LoadingPage";
import { useCourse } from "../../contexts/CourseContext";
import { isNewCourse } from "../../utils/courseUtils";
import useFetch from "../../hooks/useFetch";

const CourseCard = ({ course }) => {
  console.log(course);
  const navigate = useNavigate();

  if (!course.active || course.status !== "APPROVED") return null;

  return (
    <motion.div
      key={course.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: course.id * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 max-w-4xl mx-auto cursor-pointer"
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
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2";
            }}
          />
          {isNewCourse(course.createdAt) && (
            <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-md text-sm font-medium">
              New
            </div>
          )}
        </div>

        <div className="p-4 md:w-2/3">
          <h3 className="text-lg font-bold text-foreground mb-2">
            {course.title}
          </h3>
          <p className="text-accent mb-2">{course.owner.fullName}</p>

          <p className="text-sm text-accent mb-3">{course.shortIntroduce}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {course.fields.map((field) => (
              <span
                key={field.id}
                className="text-sm px-2 py-1 bg-muted rounded-full text-accent"
              >
                {field.name}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {course.skills.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className="text-sm px-2 py-1 bg-primary/10 rounded-full text-primary"
              >
                {skill.name}
              </span>
            ))}
            {course.skills.length > 3 && (
              <span className="text-sm px-2 py-1 bg-primary/10 rounded-full text-primary">
                +{course.skills.length - 3} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-bold text-primary">
                {course.price.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="flex items-center">
              <FiStar className="text-chart-4 mr-1" />
              <span className="text-sm text-accent">
                {course.overallRating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CourseListingPage = () => {
  const { category } = useParams();
  const { courses, isLoadingCourses, fetchCoursesByParams } = useCourse();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    skills: [],
    priceRange: "all",
    minRating: 0,
  });
  const [sortOption, setSortOption] = useState("newest");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const { data: categories } = useFetch("/fields");
  const { data: skills } = useFetch("/skills");

  useEffect(() => {
    if (category) {
      fetchCoursesByParams({ filter: `fields.id~'${category}'` });
      setFilters((prev) => ({ ...prev, category: category }));
    } else {
      fetchCoursesByParams();
    }
  }, [category]);

  if (isLoadingCourses || !categories || !skills) {
    return <LoadingPage />;
  }

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const getSkillsByField = (fieldId) => {
    return skills.result.filter((skill) => skill.field.id === fieldId);
  };

  const handleSkillChange = (skillId) => {
    setFilters((prev) => {
      const isSelected = prev.skills.includes(skillId);
      const newSkills = isSelected
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId];
      return { ...prev, skills: newSkills };
    });
  };

  const sortCourses = (courses) => {
    switch (sortOption) {
      case "newest":
        return [...courses].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return [...courses].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "priceAsc":
        return [...courses].sort((a, b) => a.price - b.price);
      case "priceDesc":
        return [...courses].sort((a, b) => b.price - a.price);
      case "popular":
        return [...courses].sort(
          (a, b) => b.studentQuantity - a.studentQuantity
        );
      case "rating":
        return [...courses].sort((a, b) => b.overallRating - a.overallRating);
      default:
        return courses;
    }
  };

  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.category === "all" ||
        course.fields.some(
          (field) => field.id.toString() === filters.category.toString()
        )) &&
      (filters.skills.length === 0 ||
        filters.skills.some((skillId) =>
          course.skills.some((skill) => skill.id === skillId)
        )) &&
      (filters.priceRange === "all" ||
        (filters.priceRange === "free" && course.price === 0) ||
        (filters.priceRange === "paid" && course.price > 0)) &&
      course.overallRating >= filters.minRating
    );
  });

  const sortedCourses = sortCourses(filteredCourses);

  return (
    <div className="bg-background px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Section */}
          <motion.div
            className={`md:w-72 bg-card p-4 rounded-lg shadow-sm overflow-y-auto ${
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

            <div className="space-y-6">
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
                  {categories?.result.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
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

              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    // Count courses with overall rating >= current rating
                    const countWithRating = courses.filter(
                      (course) => Math.floor(course.overallRating) >= rating
                    ).length;

                    return (
                      <div
                        key={rating}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted ${
                          filters.minRating === rating
                            ? "bg-primary/10 border border-primary/30"
                            : ""
                        }`}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            minRating: prev.minRating === rating ? 0 : rating,
                          }))
                        }
                      >
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < rating ? "text-yellow-400" : "text-gray-300"
                              }
                              size={16}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-accent">
                          {countWithRating}
                        </span>
                      </div>
                    );
                  })}
                  {filters.minRating > 0 && (
                    <div className="flex justify-end mt-1">
                      <button
                        className="text-xs text-primary"
                        onClick={() => setFilters({ ...filters, minRating: 0 })}
                      >
                        Clear filter
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skills</label>
                <div className="pr-2">
                  {categories?.result.map((category) => (
                    <div key={category.id} className="mb-2">
                      <button
                        className="flex items-center justify-between w-full p-2 bg-muted hover:bg-muted/80 rounded-sm text-left"
                        onClick={() => toggleCategoryExpansion(category.id)}
                      >
                        <span className="font-medium text-sm">
                          {category.name}
                        </span>
                        {expandedCategories[category.id] ? (
                          <FaChevronUp size={12} />
                        ) : (
                          <FaChevronDown size={12} />
                        )}
                      </button>

                      {expandedCategories[category.id] && (
                        <div className="ml-2 mt-1 space-y-1">
                          {getSkillsByField(category.id).map((skill) => (
                            <div key={skill.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`skill-${skill.id}`}
                                checked={filters.skills.includes(skill.id)}
                                onChange={() => handleSkillChange(skill.id)}
                                className="mr-2"
                              />
                              <label
                                htmlFor={`skill-${skill.id}`}
                                className="text-sm text-accent"
                              >
                                {skill.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {filters.skills.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Selected Skills</span>
                    <button
                      className="text-xs text-primary"
                      onClick={() => setFilters({ ...filters, skills: [] })}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {filters.skills.map((skillId) => {
                      const skill = skills.result.find((s) => s.id === skillId);
                      return (
                        skill && (
                          <span
                            key={skillId}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center"
                          >
                            {skill.name}
                            <button
                              className="ml-1 hover:text-primary-foreground"
                              onClick={() => handleSkillChange(skillId)}
                            >
                              <FaTimes size={10} />
                            </button>
                          </span>
                        )
                      );
                    })}
                  </div>
                </div>
              )}
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
              <div className="flex flex-wrap justify-between items-center mt-2 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="md:hidden flex items-center text-accent hover:text-accent-foreground"
                  >
                    <FaFilter className="mr-2" /> Show Filters
                  </button>
                  <div className="text-sm text-accent">
                    Showing {filteredCourses.length} courses
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-accent">Sort by:</span>
                  <select
                    className="p-1 border rounded-sm bg-muted text-sm"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {sortedCourses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 text-accent"
                >
                  No courses found matching your criteria
                </motion.div>
              ) : (
                <div className="bg-background p-6 min-h-[400px]">
                  <div className="max-w-7xl mx-auto">
                    <motion.div layout className="space-y-6">
                      {sortedCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </motion.div>
                  </div>
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
