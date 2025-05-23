import { motion } from "framer-motion";
import { FiBookmark, FiAward, FiBarChart, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useMyOrder } from "../../contexts/MyOrderContext";
import courseDefault from "../../assets/images/course-default.png";
import useFetch from "../../hooks/useFetch";
import { Skeleton } from "../../components/ui/Skeleton";
const LearningDashboardPage = () => {
  const { myOrders: orders } = useMyOrder();
  const { data: recommendedCoursesData, loading } = useFetch(`/courses`, {
    status: "APPROVED",
    active: true,
    size: 10,
  });

  // Get IDs of courses that user already owns
  const ownedCourseIds = orders.map((order) => order.course.id);

  // Filter out owned courses and get 2 random courses
  const recommendedCourses =
    recommendedCoursesData?.result
      ?.filter((course) => !ownedCourseIds.includes(course.id))
      .sort(() => Math.random() - 0.5) // Randomize the array
      .slice(0, 2) || []; // Take only 2 courses

  // Filter approved and active courses
  const approvedCourses = orders.filter(
    (order) =>
      order.course.status === "APPROVED" && order.course.active === true
  );

  const pendingCourses = orders.filter(
    (order) =>
      order.course.status !== "APPROVED" || order.course.active !== true
  );

  // Calculate total lectures and completed lectures for each course
  const calculateProgress = (course) => {
    let totalLectures = 0;
    let completedLectures = 0;

    // Loop through all chapters and lectures to count
    course.chapters?.forEach((chapter) => {
      chapter.lectures?.forEach((lecture) => {
        totalLectures++;
        if (lecture.lectureProcess?.done === true) {
          completedLectures++;
        }
      });
    });

    const progressPercentage =
      totalLectures > 0
        ? Math.floor((completedLectures / totalLectures) * 100)
        : 0;

    return {
      totalLectures,
      completedLectures,
      progressPercentage,
    };
  };

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  console.log("Orders:", orders);

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
              {approvedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {approvedCourses.map((order) => {
                    const {
                      totalLectures,
                      completedLectures,
                      progressPercentage,
                    } = calculateProgress(order.course);
                    return (
                      <motion.div
                        key={order.course.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-card rounded-lg overflow-hidden shadow-sm"
                      >
                        <Link
                          to={`/student/learning/${order.course.id}/${order.course.chapters[0]?.lectures[0].id}`}
                        >
                          <img
                            src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${
                              order.course.id
                            }/${order.course.image}`}
                            alt={order.course.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src = courseDefault;
                            }}
                          />
                          <div className="p-4">
                            <h3 className={`font-heading mb-2 text-foreground`}>
                              {order.course.title}
                            </h3>
                            <p className="text-accent-foreground text-sm mb-4 line-clamp-2">
                              {order.course.description?.length > 150
                                ? `${order.course.description.substring(
                                    0,
                                    150
                                  )}...`
                                : order.course.description ||
                                  "No description available"}
                            </p>
                            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                className="absolute top-0 left-0 h-full bg-primary"
                              />
                            </div>
                            <p className="text-sm text-accent-foreground mt-2">
                              {completedLectures} of {totalLectures} lectures
                              completed
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <FiSearch className="text-4xl text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No active courses available
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You don't have any active courses at the moment. Browse our
                    catalog to find courses that interest you.
                  </p>
                  <Link
                    to="/courses"
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}

              {/* Pending Courses Section */}
              {pendingCourses.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-heading font-heading mb-4">
                    Pending Approval
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingCourses.map((order) => (
                      <motion.div
                        key={order.course.id}
                        className="bg-muted rounded-lg overflow-hidden shadow-sm p-4"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${
                              order.course.id
                            }/${order.course.image}`}
                            alt={order.course.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div>
                            <h4 className="font-semibold mb-1">
                              {order.course.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              This course is currently{" "}
                              {order.course.active
                                ? "pending approval"
                                : "inactive"}
                              . You'll be notified when it becomes available.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
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
              <h2 className="text-heading font-heading mb-4">
                Recommended For You
              </h2>
              <div className="space-y-4">
                {recommendedCourses.length > 0 ? (
                  recommendedCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-muted rounded-lg overflow-hidden"
                    >
                      <Link to={`/courses/${course.id}`}>
                        <div className="relative">
                          <img
                            src={
                              course.image.startsWith("http")
                                ? course.image
                                : `${import.meta.env.VITE_COURSE_IMAGE_URL}/${
                                    course.id
                                  }/${course.image}`
                            }
                            alt={course.title}
                            className="w-full h-40 object-cover"
                            onError={(e) => {
                              e.target.src = courseDefault;
                            }}
                          />
                          {course.overallRating >= 4 && (
                            <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                              <FiAward className="text-black" />
                              {course.overallRating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {course.fields.slice(0, 2).map((field) => (
                              <span
                                key={field.id}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                              >
                                {field.name}
                              </span>
                            ))}
                            {course.fields.length > 2 && (
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                                +{course.fields.length - 2} more
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {course.owner.fullName}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                • {course.studentQuantity} students
                              </span>
                            </div>
                            <div className="font-semibold text-primary">
                              {course.price === 0
                                ? "Free"
                                : `${course.price.toLocaleString("vi-VN")}đ`}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      No recommended courses available at the moment.
                    </p>
                    <Link
                      to="/courses"
                      className="text-primary hover:underline"
                    >
                      Browse all courses
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearningDashboardPage;
