import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiStar,
  FiCode,
  FiPenTool,
  FiMusic,
  FiCamera,
} from "react-icons/fi";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { icon: <FiCode />, name: "Programming", courses: 150 },
    { icon: <FiPenTool />, name: "Design", courses: 120 },
    { icon: <FiMusic />, name: "Music", courses: 80 },
    { icon: <FiCamera />, name: "Photography", courses: 90 },
  ];

  const featuredCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      price: 99.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      description: "Master web development from scratch",
    },
    {
      id: 2,
      title: "UX/UI Design Masterclass",
      instructor: "Sarah Johnson",
      price: 89.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
      description: "Create stunning user experiences",
    },
    {
      id: 3,
      title: "Digital Marketing Essential",
      instructor: "Mike Wilson",
      price: 79.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      description: "Learn modern marketing strategies",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Emily Brown",
      course: "Web Development Bootcamp",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      quote: "This course transformed my career path completely!",
    },
    {
      id: 2,
      name: "David Chen",
      course: "UX/UI Design Masterclass",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      quote: "The best investment I've made in my design journey.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Transform Your Future with Online Learning
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl mb-8"
          >
            Access world-class education at your fingertips
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-3 rounded-md text-lg font-semibold"
            onClick={() => (window.location.href = "/courses")}
          >
            Start Learning Now
          </motion.button>
        </div>
      </motion.section>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative max-w-2xl mx-auto">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent" />
          <input
            type="text"
            placeholder="Search for courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Popular Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-card p-6 rounded-lg shadow-sm cursor-pointer"
            >
              <div className="text-4xl text-primary mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-accent">{category.courses} courses</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -10 }}
                className="bg-card rounded-lg overflow-hidden shadow-sm"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-accent mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">
                      ${course.price}
                    </span>
                    <div className="flex items-center">
                      <FiStar className="text-chart-4" />
                      <span className="ml-1">{course.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          What Our Students Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-accent text-sm">{testimonial.course}</p>
                </div>
              </div>
              <p className="text-foreground italic">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
