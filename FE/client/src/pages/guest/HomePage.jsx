import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiStar,
  FiBookOpen,
  FiUsers,
  FiCode,
  FiPenTool,
  FiMusic,
  FiCamera,
} from "react-icons/fi";
import {
  FaLaptopCode,
  FaServer,
  FaDatabase,
  FaGraduationCap,
  FaMobileAlt,
  FaChartLine,
  FaCloudUploadAlt,
  FaGamepad,
  FaRobot,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";
import useFetch from "../../hooks/useFetch";
import LoadingPage from "../../components/common/LoadingPage";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { getReviews } from "../../services/review.services";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: coursesData, isLoading: isLoadingCourses } =
    useFetch("/courses?size=9999");
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const { data: categories } = useFetch("/fields");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await getReviews();
      setReviews(response.result);
    };
    fetchReviews();
  }, []);
  // Lấy 3 khóa học ngẫu nhiên khi dữ liệu được tải
  useEffect(() => {
    if (coursesData?.result && coursesData.result.length > 0) {
      // Lọc các khóa học đã được duyệt và đang active
      const filtered = coursesData.result.filter(
        (course) => course.status === "APPROVED" && course.active === true
      );
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      setFeaturedCourses(shuffled.slice(0, 3));
    }
  }, [coursesData]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categoriesWithIcons = [
    {
      name: "Web Development",
      icon: <FaLaptopCode size={28} className="text-blue-500" />,
    },
    {
      name: "Mobile Development",
      icon: <FaMobileAlt size={28} className="text-green-500" />,
    },
    {
      name: "Backend Development",
      icon: <FaServer size={28} className="text-purple-500" />,
    },
    {
      name: "Database",
      icon: <FaDatabase size={28} className="text-red-500" />,
    },
    {
      name: "DevOps / Deployment",
      icon: <FaCloudUploadAlt size={28} className="text-sky-500" />,
    },
    {
      name: "UI/UX Design",
      icon: <FiPenTool size={28} className="text-indigo-500" />,
    },
    {
      name: "Game Development",
      icon: <FaGamepad size={28} className="text-yellow-500" />,
    },
    {
      name: "Machine Learning / AI",
      icon: <FaRobot size={28} className="text-slate-500" />,
    },
    {
      name: "Data Science",
      icon: <FaChartLine size={28} className="text-green-500" />,
    },
    {
      name: "Cybersecurity",
      icon: <FaShieldAlt size={28} className="text-red-500" />,
    },
    {
      name: "Programming Languages",
      icon: <FiCode size={28} className="text-gray-700" />,
    },
    {
      name: "Photography",
      icon: <FiCamera size={28} className="text-pink-500" />,
    },
    { name: "Music", icon: <FiMusic size={28} className="text-purple-400" /> },
  ];

  // Get field icon based on field name
  const getFieldIcon = (field) => {
    const category = categoriesWithIcons.find((cat) =>
      field.name.toLowerCase().includes(cat.name.toLowerCase())
    );
    return category ? (
      category.icon
    ) : (
      <FiBookOpen size={28} className="text-primary" />
    );
  };

  if (isLoadingCourses) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[70vh] flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center px-4 max-w-4xl">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Learn Skills for Your Future Career
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl mb-8 text-gray-200"
          >
            Discover courses taught by industry experts and expand your
            knowledge
          </motion.p>

          <motion.form
            className="max-w-lg mx-auto relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              placeholder="What do you want to learn today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-white/20 bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:border-primary"
            />
            <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white text-xl" />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
            >
              Search
            </Button>
          </motion.form>
        </div>
      </motion.section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-3 text-center">
          Explore Categories
        </h2>
        <p className="text-accent text-center max-w-2xl mx-auto mb-12">
          Browse courses in the most in-demand and highest-paying professional
          fields
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories?.result?.slice(0, 12).map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              className="bg-card p-5 rounded-lg shadow-sm text-center cursor-pointer"
              onClick={() => navigate(`/courses/${category.id}`)}
            >
              <div className="flex justify-center mb-4">
                {getFieldIcon(category)}
              </div>
              <h3 className="text-lg font-semibold line-clamp-2">
                {category.name}
              </h3>
              <p className="text-accent text-sm mt-1">
                {category.skills?.length || 0} skills
              </p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => navigate("/courses")}>
            View All Categories
          </Button>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="bg-secondary/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-3 text-center">
            Featured Courses
          </h2>
          <p className="text-accent text-center max-w-2xl mx-auto mb-12">
            Expand your skills with our most popular and highly-rated courses
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -5 }}
                className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() =>
                  navigate(`/courses/${course.fields[0].id}/${course.id}`)
                }
              >
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${
                      course.id
                    }/${course.image}`}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";
                    }}
                  />
                  {course.fields[0] && (
                    <Badge className="absolute top-2 left-2">
                      {course.fields[0].name}
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-accent mb-2">{course.owner.fullName}</p>
                  <p className="text-sm text-accent mb-4 line-clamp-2">
                    {course.shortIntroduce}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">
                      {course.price.toLocaleString("vi-VN")} VNĐ
                    </span>
                    <div className="flex items-center">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < Math.floor(course.overallRating || 0)
                                ? "text-yellow-400 text-sm"
                                : "text-gray-300 text-sm"
                            }
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-accent">
                        ({course.totalRating || 0})
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button onClick={() => navigate("/courses")}>
              Browse All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card p-6 rounded-lg shadow-sm"
          >
            <FiBookOpen className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">
              {coursesData?.meta?.totalElement || "200+"}
            </h3>
            <p className="text-accent">Total Courses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card p-6 rounded-lg shadow-sm"
          >
            <FiUsers className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">10,000+</h3>
            <p className="text-accent">Active Students</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-card p-6 rounded-lg shadow-sm"
          >
            <FiCode className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">
              {categories?.meta?.totalElement || "15+"}
            </h3>
            <p className="text-accent">Categories</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-card p-6 rounded-lg shadow-sm"
          >
            <FiStar className="text-4xl text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">4.7</h3>
            <p className="text-accent">Average Rating</p>
          </motion.div>
        </div>
      </section>

      {/* Become Instructor Section */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Become an Instructor
              </h2>
              <p className="text-lg mb-6">
                Join our community of expert instructors and share your
                knowledge with students worldwide. Create engaging courses and
                earn income while making an impact.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/instructor/register")}
              >
                <FaGraduationCap className="mr-2" />
                Start Teaching Today
              </Button>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1544531586-fde5298cdd40"
                alt="Become an instructor"
                className="rounded-lg shadow-md w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-3 text-center">
          Student Success Stories
        </h2>
        <p className="text-accent text-center max-w-2xl mx-auto mb-12">
          Hear what our students have to say about their learning experience
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews
            .filter((review) => review.rating === 5)
            .slice(0, 3)
            .map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-card p-6 rounded-lg shadow-sm"
              >
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="w-20 h-20 mb-4">
                    <AvatarImage
                      src={
                        review.user.avatar || "https://via.placeholder.com/150"
                      }
                      alt={review.user.fullName}
                    />
                    <AvatarFallback>
                      {review.user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h4 className="font-semibold">{review.user.fullName}</h4>
                    <p className="text-accent text-sm">
                      {review.course.title} Student
                    </p>
                  </div>
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground text-center italic">
                  "{review.comment}"
                </p>
              </motion.div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
