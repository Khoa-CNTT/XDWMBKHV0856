import { motion } from "framer-motion";
import { FiBookmark, FiAward, FiBarChart } from "react-icons/fi";
// import { useOrderStore } from "../../store/useOrderStore";
import { Link } from "react-router-dom";

const LearningDashboardPage = () => {
  const { orders } = useOrderStore();

  const courses = [
    {
      id: 1,
      title: "Advanced Web Development",
      progress: 75,
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      description: "Master modern web technologies and frameworks",
      totalLectures: 48,
      completedLectures: 36,
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      progress: 60,
      thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb",
      description: "Learn the principles of user interface design",
      totalLectures: 36,
      completedLectures: 22,
    },
    {
      id: 3,
      title: "Data Science Essentials",
      progress: 30,
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      description: "Introduction to data analysis and visualization",
      totalLectures: 42,
      completedLectures: 12,
    },
  ];

  const recommendedCourses = [
    {
      id: 3,
      title: "Mobile App Development",
      thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
      instructor: "Mike Brown",
      rating: 4.8,
    },
    {
      id: 4,
      title: "Data Science Essentials",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      instructor: "Emma Wilson",
      rating: 4.9,
    },
  ];

  return (
    <div className={`min-h-screen bg-background mt-20`}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Active Learning Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Progress */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-heading font-heading mb-4">Your Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((order) => (
                  <motion.div
                    key={order.course.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card rounded-lg overflow-hidden shadow-sm"
                  >
                    <Link to={`/student/course/${order.course.id}/1`}>
                      <img
                        src={order.course.image}
                        alt={order.course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className={`font-heading mb-2 text-foreground`}>
                          {order.course.title}
                        </h3>
                        <p className="text-accent-foreground text-sm mb-4">
                          {order.course.description ||
                            "No description available"}
                        </p>
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${75}%` }}
                            className="absolute top-0 left-0 h-full bg-primary"
                          />
                        </div>
                        <p className="text-sm text-accent-foreground mt-2">
                          {36} of {48} lectures completed
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievement Section */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-heading font-heading mb-4">Achievements</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <FiAward className="text-primary text-xl" />
                  <div>
                    <div className="font-semibold">Perfect Score</div>
                    <div className="text-sm text-accent">5 Courses</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <FiBarChart className="text-primary text-xl" />
                  <div>
                    <div className="font-semibold">Top Learner</div>
                    <div className="text-sm text-accent">This Week</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-heading font-heading mb-4">Recommended</h2>
              <div className="space-y-4">
                {recommendedCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-muted rounded-lg p-4"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <h3 className="font-semibold mb-1">{course.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-accent">
                        {course.instructor}
                      </span>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold mr-1">
                          {course.rating}
                        </span>
                        <FiBookmark className="text-primary" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningDashboardPage;
