import { useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaStar,
  FaShare,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaCartPlus,
  FaCartArrowDown,
} from "react-icons/fa";
import { BsCode, BsDatabase, BsLaptop } from "react-icons/bs";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../contexts/CartContext";

const CourseDetailPage = () => {
  const { courseId, category } = useParams();
  const {
    data: course,
    error,
    loading,
  } = useFetch(`course-details/${courseId}`);
  const { addToCart } = useCart();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const courseData = {
    title: "Advanced Web Development Masterclass",
    description:
      "Master modern web development with this comprehensive course covering frontend, backend, and deployment. Learn through hands-on projects and real-world applications.",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    rating: 4.8,
    totalReviews: 1234,
    positivePercentage: 98,
    instructor: {
      name: "Dr. Sarah Johnson",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      title: "Senior Web Development Instructor",
    },
  };

  const learningFields = [
    {
      title: "Frontend Development",
      icon: <BsLaptop className="w-8 h-8 text-primary" />,
      skills: ["React.js", "TypeScript", "Responsive Design"],
    },
    {
      title: "Backend Development",
      icon: <BsDatabase className="w-8 h-8 text-primary" />,
      skills: ["Node.js", "PostgreSQL", "RESTful APIs"],
    },
    {
      title: "Development Tools",
      icon: <BsCode className="w-8 h-8 text-primary" />,
      skills: ["Git", "Docker", "CI/CD"],
    },
  ];

  const reviews = [
    {
      name: "John Smith",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      text: "This course transformed my development skills completely. The practical approach and real-world projects were invaluable.",
      date: "2024-01-15",
      rating: 5,
    },
    {
      name: "Emily Davis",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      text: "Excellent content and structure. The instructor's explanations were clear and concise.",
      date: "2024-01-10",
      rating: 5,
    },
    {
      name: "Michael Chen",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      text: "Worth every penny! The course goes deep into advanced concepts while maintaining clarity.",
      date: "2024-01-05",
      rating: 4,
    },
  ];

  const curriculumData = [
    {
      title: "Module 1: Foundation",
      duration: "4 weeks",
      lectures: [
        {
          title: "Introduction to Web Development",
          duration: "45 min",
          isPreview: true,
        },
        {
          title: "HTML5 & CSS3 Fundamentals",
          duration: "1h 30min",
          isPreview: false,
        },
        {
          title: "JavaScript Basics",
          duration: "2h",
          isPreview: false,
        },
      ],
    },
    {
      title: "Module 2: Frontend Development",
      duration: "6 weeks",
      lectures: [
        {
          title: "React.js Fundamentals",
          duration: "2h 30min",
          isPreview: true,
        },
        {
          title: "State Management with Redux",
          duration: "1h 45min",
          isPreview: false,
        },
        {
          title: "Building Responsive UIs",
          duration: "2h 15min",
          isPreview: false,
        },
      ],
    },
    {
      title: "Module 3: Backend Integration",
      duration: "5 weeks",
      lectures: [
        {
          title: "Node.js & Express",
          duration: "2h",
          isPreview: false,
        },
        {
          title: "Database Design",
          duration: "1h 30min",
          isPreview: false,
        },
        {
          title: "API Development",
          duration: "2h 45min",
          isPreview: false,
        },
      ],
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[60vh] overflow-hidden"
      >
        <img
          src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${course?.id}/${
            course?.image
          }`}
          alt={course?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {course?.title}
            </h1>
            <p className="text-xl mb-8 max-w-2xl">{course?.description}</p>
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md text-lg font-semibold transition-all">
              Buy Now
            </button>
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            What You'll Learn
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {learningFields.map((field, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-card p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-4">
                  {field.icon}
                  <h3 className="text-xl font-semibold ml-3">{field.title}</h3>
                </div>
                <ul className="space-y-2">
                  {field.skills.map((skill, idx) => (
                    <li key={idx} className="flex items-center text-accent">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16 bg-card p-8 rounded-lg shadow-sm"
        >
          <h2 className="text-3xl font-bold mb-8">Your Instructor</h2>
          <div className="flex items-center">
            <img
              src={courseData.instructor.image}
              alt={courseData.instructor.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="ml-6">
              <h3 className="text-xl font-semibold">
                {courseData.instructor.name}
              </h3>
              <p className="text-accent">{courseData.instructor.title}</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Student Reviews</h2>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(courseData.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{courseData.rating}</span>
              <span className="text-accent ml-2">
                ({courseData.totalReviews} reviews)
              </span>
            </div>
          </div>

          <Slider {...sliderSettings} className="-mx-2">
            {reviews.map((review, index) => (
              <div key={index} className="px-2">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-card p-6 rounded-lg shadow-sm h-full"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="font-semibold">{review.name}</h4>
                      <p className="text-sm text-accent">{review.date}</p>
                    </div>
                  </div>
                  <p className="text-accent-foreground">{review.text}</p>
                  <div className="flex items-center mt-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </motion.section>

        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Course Curriculum</h2>
          <div className="space-y-6">
            {curriculumData.map((module, moduleIndex) => (
              <motion.div
                key={moduleIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: moduleIndex * 0.1 }}
                className="bg-card rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-primary/5 p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-primary">
                      {module.title}
                    </h3>
                    <span className="text-accent bg-primary/10 px-4 py-1 rounded-full text-sm">
                      {module.duration}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {module.lectures.map((lecture, lectureIndex) => (
                    <div
                      key={lectureIndex}
                      className="flex items-center justify-between py-4 border-b last:border-0"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary text-sm font-medium">
                            {lectureIndex + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{lecture.title}</h4>
                          <p className="text-sm text-accent">
                            {lecture.duration}
                          </p>
                        </div>
                      </div>
                      {lecture.isPreview && (
                        <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                          Preview
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="fixed bottom-8 right-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            // onClick={() => addToCart({
            //   wishlistId: course?.id,
            // })}
            className="bg-primary text-white p-4 rounded-full shadow-lg"
          >
            <FiShoppingCart className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
