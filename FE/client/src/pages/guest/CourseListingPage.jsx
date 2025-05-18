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
import { FiStar } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingPage from "../../components/common/LoadingPage";
import { useCourse } from "../../contexts/CourseContext";
import { isNewCourse } from "../../utils/courseUtils";
import useFetch from "../../hooks/useFetch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Separator } from "../../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

const CourseCard = ({ course }) => {
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { courses, isLoadingCourses, fetchCoursesByParams, pagination } =
    useCourse();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    skills: [],
    priceRange: "all",
    minRating: 0,
  });
  const [sortOption, setSortOption] = useState("newest");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const { data: categories } = useFetch("/fields");
  const { data: skills } = useFetch("/skills");

  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get("page")) || 1;

  // Add debug logs
  console.log("Pagination state:", pagination);
  console.log("Courses length:", courses.length);
  console.log("Total pages:", pagination.totalPages);

  // Define price options
  const priceOptions = [
    { value: "all", label: "All Prices" },
    { value: "free", label: "Free (0 VNĐ)" },
    { value: "under100k", label: "Under 100,000 VNĐ" },
    { value: "100k-200k", label: "100,000 - 200,000 VNĐ" },
    { value: "200k-500k", label: "200,000 - 500,000 VNĐ" },
    { value: "500k-1m", label: "500,000 - 1,000,000 VNĐ" },
    { value: "over1m", label: "Over 1,000,000 VNĐ" },
  ];

  // Calculate active filters count
  const activeFiltersCount = [
    filters.categories.length > 0,
    filters.skills.length > 0,
    filters.priceRange !== "all",
    filters.minRating > 0,
  ].filter(Boolean).length;

  // Handle URL parameters for categories and pagination
  useEffect(() => {
    const categoryIds = searchParams.get("categories");
    const page = Number(searchParams.get("page")) || 1;

    if (categoryIds) {
      // Convert string of comma-separated IDs to array of numbers
      const categoryIdsArray = categoryIds.split(",").map((id) => Number(id));

      // Set the categories filter
      setFilters((prev) => ({
        ...prev,
        categories: categoryIdsArray,
      }));

      // Fetch courses with the categories filter and pagination
      const filterQuery = categoryIdsArray
        .map((id) => `fields.id~'${id}'`)
        .join("||");
      fetchCoursesByParams({ filter: filterQuery }, page);
    } else {
      // If no categories in URL, fetch all courses with pagination
      fetchCoursesByParams({}, page);
    }
  }, [searchParams]);

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
    const priceMatch = (() => {
      switch (filters.priceRange) {
        case "all":
          return true;
        case "free":
          return course.price === 0;
        case "under100k":
          return course.price > 0 && course.price < 100000;
        case "100k-200k":
          return course.price >= 100000 && course.price <= 200000;
        case "200k-500k":
          return course.price > 200000 && course.price <= 500000;
        case "500k-1m":
          return course.price > 500000 && course.price <= 1000000;
        case "over1m":
          return course.price > 1000000;
        default:
          return true;
      }
    })();

    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.categories.length === 0 ||
        course.fields.some((field) =>
          filters.categories.includes(Number(field.id))
        )) &&
      (filters.skills.length === 0 ||
        filters.skills.some((skillId) =>
          course.skills.some((skill) => skill.id === skillId)
        )) &&
      priceMatch &&
      course.overallRating >= filters.minRating
    );
  });

  const sortedCourses = sortCourses(filteredCourses);

  console.log(filteredCourses);

  // Handle page change
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    navigate(`/courses?${params.toString()}`);
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => {
      const isSelected = prev.categories.includes(categoryId);
      const newCategories = isSelected
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];

      // Update URL when categories change
      const params = new URLSearchParams(searchParams);
      if (newCategories.length > 0) {
        const categoryNames = newCategories
          .map((id) => {
            const category = categories?.result.find((c) => c.id === id);
            return category ? encodeURIComponent(category.name) : "";
          })
          .filter(Boolean)
          .join(",");
        params.set("categories", newCategories.join(","));
        params.set("categoryNames", categoryNames);
        params.set("page", "1"); // Reset to first page when changing categories
      } else {
        params.delete("categories");
        params.delete("categoryNames");
        params.set("page", "1");
      }
      navigate(`/courses?${params.toString()}`);

      return { ...prev, categories: newCategories };
    });
  };

  // Modify clearAllFilters to also clear URL
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      skills: [],
      priceRange: "all",
      minRating: 0,
    });
    navigate("/courses", { replace: true });
  };

  return (
    <div className="bg-background px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Section */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 768) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="md:w-80 bg-card rounded-lg shadow-md overflow-hidden border"
              >
                <Card className="border-0 shadow-none">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <FaFilter className="text-primary" size={16} />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </CardTitle>
                      <div className="flex gap-2">
                        {activeFiltersCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-xs h-8"
                          >
                            Clear all
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowFilters(false)}
                          className="md:hidden h-8 w-8"
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 pt-0 px-4 pb-4">
                    {/* Category Filter - Now with checkboxes for multiple selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Categories</Label>
                      <div className="space-y-1 border rounded-md p-2">
                        {categories?.result
                          .slice(0, showAllCategories ? undefined : 5)
                          .map((category) => (
                            <div
                              key={category.id}
                              className="flex items-center space-x-2 py-1.5"
                            >
                              <Checkbox
                                id={`category-${category.id}`}
                                checked={filters.categories.includes(
                                  category.id
                                )}
                                onCheckedChange={() =>
                                  handleCategoryChange(category.id)
                                }
                              />
                              <Label
                                htmlFor={`category-${category.id}`}
                                className="text-sm cursor-pointer font-medium"
                              >
                                {category.name}
                              </Label>
                            </div>
                          ))}
                        {categories?.result.length > 5 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setShowAllCategories(!showAllCategories)
                            }
                            className="w-full text-xs mt-1"
                          >
                            {showAllCategories ? "Show less" : "Show more"}
                          </Button>
                        )}
                      </div>

                      {filters.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {filters.categories.map((categoryId) => {
                            const category = categories.result.find(
                              (c) => c.id === categoryId
                            );
                            return (
                              category && (
                                <Badge
                                  key={categoryId}
                                  variant="outline"
                                  className="bg-primary/5 hover:bg-primary/10 transition-colors"
                                >
                                  {category.name}
                                  <button
                                    className="ml-1 hover:text-destructive"
                                    onClick={() =>
                                      handleCategoryChange(categoryId)
                                    }
                                  >
                                    <FaTimes size={10} />
                                  </button>
                                </Badge>
                              )
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Skills Filter - Now automatically shows for selected categories */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Skills</Label>

                      {filters.categories.length === 0 ? (
                        <div className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/30">
                          Select one or more categories to see available skills
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {filters.categories.map((categoryId) => {
                            const category = categories.result.find(
                              (c) => c.id === categoryId
                            );
                            const categorySkills = getSkillsByField(categoryId);

                            return (
                              <Collapsible
                                key={categoryId}
                                open={expandedCategories[categoryId]}
                                onOpenChange={() =>
                                  toggleCategoryExpansion(categoryId)
                                }
                                className="border rounded-md overflow-hidden"
                              >
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 text-left">
                                  <span className="font-medium text-sm">
                                    {category?.name} Skills
                                  </span>
                                  {expandedCategories[categoryId] ? (
                                    <FaChevronUp size={12} />
                                  ) : (
                                    <FaChevronDown size={12} />
                                  )}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="p-2 bg-muted/30 border-t">
                                  <div className="space-y-1">
                                    {categorySkills.length > 0 ? (
                                      categorySkills.map((skill) => (
                                        <div
                                          key={skill.id}
                                          className="flex items-center space-x-2 py-1"
                                        >
                                          <Checkbox
                                            id={`skill-${skill.id}`}
                                            checked={filters.skills.includes(
                                              skill.id
                                            )}
                                            onCheckedChange={() =>
                                              handleSkillChange(skill.id)
                                            }
                                          />
                                          <Label
                                            htmlFor={`skill-${skill.id}`}
                                            className="text-sm cursor-pointer"
                                          >
                                            {skill.name}
                                          </Label>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-sm text-muted-foreground py-1">
                                        No skills available for this category
                                      </div>
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Selected Skills */}
                    {filters.skills.length > 0 && (
                      <div className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-sm font-medium">
                            Selected Skills
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setFilters({ ...filters, skills: [] })
                            }
                            className="h-6 text-xs"
                          >
                            Clear
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {filters.skills.map((skillId) => {
                            const skill = skills.result.find(
                              (s) => s.id === skillId
                            );
                            return (
                              skill && (
                                <Badge
                                  key={skillId}
                                  variant="outline"
                                  className="bg-primary/5 hover:bg-primary/10 transition-colors"
                                >
                                  {skill.name}
                                  <button
                                    className="ml-1 hover:text-destructive"
                                    onClick={() => handleSkillChange(skillId)}
                                  >
                                    <FaTimes size={10} />
                                  </button>
                                </Badge>
                              )
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <Separator />

                    {/* Price Range Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Price Range</Label>
                      <Select
                        value={filters.priceRange}
                        onValueChange={(value) =>
                          setFilters({ ...filters, priceRange: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          {priceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Rating Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Rating</Label>
                      <div className="space-y-1 pt-1">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const countWithRating = courses.filter(
                            (course) =>
                              Math.floor(course.overallRating) >= rating
                          ).length;

                          return (
                            <div
                              key={rating}
                              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                                filters.minRating === rating
                                  ? "bg-primary/10 border border-primary/30"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() =>
                                setFilters((prev) => ({
                                  ...prev,
                                  minRating:
                                    prev.minRating === rating ? 0 : rating,
                                }))
                              }
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <FaStar
                                      key={i}
                                      className={
                                        i < rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }
                                      size={14}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm">{rating}.0</span>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-xs font-normal"
                              >
                                {countWithRating}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

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
                    Showing {courses.length} of {pagination.totalItems} courses
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

                    {/* Pagination Section */}
                    {pagination.totalPages > 1 && (
                      <div className="mt-8 space-y-4">
                        {/* Pagination Controls */}
                        <div className="flex justify-center">
                          <Pagination>
                            <PaginationContent className="flex items-center gap-1">
                              {/* Previous Button */}
                              <PaginationItem>
                                <PaginationPrevious
                                  onClick={() =>
                                    handlePageChange(currentPage - 1)
                                  }
                                  disabled={currentPage === 1}
                                  className={`
                                    h-9 px-8 rounded-md border
                                    ${
                                      currentPage === 1
                                        ? "opacity-50 cursor-not-allowed bg-muted"
                                        : "hover:bg-accent cursor-pointer"
                                    }
                                  `}
                                />
                              </PaginationItem>

                              {/* First Page */}
                              {currentPage > 2 && (
                                <>
                                  <PaginationItem>
                                    <PaginationLink
                                      onClick={() => handlePageChange(1)}
                                      className="h-9 w-9 rounded-md border hover:bg-accent"
                                    >
                                      1
                                    </PaginationLink>
                                  </PaginationItem>
                                  {currentPage > 3 && (
                                    <PaginationItem>
                                      <PaginationEllipsis className="h-9 w-9 flex items-center justify-center" />
                                    </PaginationItem>
                                  )}
                                </>
                              )}

                              {/* Previous Page */}
                              {currentPage > 1 && (
                                <PaginationItem>
                                  <PaginationLink
                                    onClick={() =>
                                      handlePageChange(currentPage - 1)
                                    }
                                    className="h-9 w-9 rounded-md border hover:bg-accent"
                                  >
                                    {currentPage - 1}
                                  </PaginationLink>
                                </PaginationItem>
                              )}

                              {/* Current Page */}
                              <PaginationItem>
                                <PaginationLink
                                  isActive
                                  className="h-9 w-9 rounded-md border bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                  {currentPage}
                                </PaginationLink>
                              </PaginationItem>

                              {/* Next Page */}
                              {currentPage < pagination.totalPages && (
                                <PaginationItem>
                                  <PaginationLink
                                    onClick={() =>
                                      handlePageChange(currentPage + 1)
                                    }
                                    className="h-9 w-9 rounded-md border hover:bg-accent"
                                  >
                                    {currentPage + 1}
                                  </PaginationLink>
                                </PaginationItem>
                              )}

                              {/* Last Page */}
                              {currentPage < pagination.totalPages - 1 && (
                                <>
                                  {currentPage < pagination.totalPages - 2 && (
                                    <PaginationItem>
                                      <PaginationEllipsis className="h-9 w-9 flex items-center justify-center" />
                                    </PaginationItem>
                                  )}
                                  <PaginationItem>
                                    <PaginationLink
                                      onClick={() =>
                                        handlePageChange(pagination.totalPages)
                                      }
                                      className="h-9 w-9 rounded-md border hover:bg-accent"
                                    >
                                      {pagination.totalPages}
                                    </PaginationLink>
                                  </PaginationItem>
                                </>
                              )}

                              {/* Next Button */}
                              <PaginationItem>
                                <PaginationNext
                                  onClick={() =>
                                    handlePageChange(currentPage + 1)
                                  }
                                  disabled={
                                    currentPage === pagination.totalPages
                                  }
                                  className={`
                                    h-9 px-8 rounded-md border
                                    ${
                                      currentPage === pagination.totalPages
                                        ? "opacity-50 cursor-not-allowed bg-muted"
                                        : "hover:bg-accent cursor-pointer"
                                    }
                                  `}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>

                        {/* Page Info */}
                        <div className="text-center text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {courses.length}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium text-foreground">
                            {pagination.totalItems}
                          </span>{" "}
                          courses
                        </div>
                      </div>
                    )}
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
