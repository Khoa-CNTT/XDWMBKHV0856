import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaClock,
  FaGlobe,
  FaPlayCircle,
  FaAward,
  FaShoppingCart,
  FaStar,
  FaUsers,
  FaFileAlt,
  FaInfinity,
  FaMobileAlt,
  FaCheck,
  FaCode,
  FaLaptopCode,
  FaServer,
  FaDatabase,
  FaCloud,
  FaGamepad,
  FaRobot,
  FaChartLine,
  FaMicrochip,
  FaShieldAlt,
  FaPaintBrush,
  FaTerminal,
  FaBug,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import CourseReviews from "../../components/CourseDetails/CourseReviews";
import RelatedCourses from "../../components/CourseDetails/RelatedCourses";
import CoursePreview from "../../components/CourseDetails/CoursePreview";
import useFetch from "../../hooks/useFetch";
import { isNewCourse } from "../../utils/courseUtils";
import { useCart } from "../../contexts/CartContext";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

// Added import for video player component
import ReactPlayer from "react-player";
import LectureItem from "../../components/CourseLearning/LectureItem";
import { getOrderByUserIdAndCourseId } from "../../services/order.services";
import { useAuth } from "../../contexts/AuthContext";

function CourseDetailPage() {
  const { courseId } = useParams();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const { data: course } = useFetch(`course-details/${courseId}`);
  const [totalDuration, setTotalDuration] = useState("0 hours");
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Add state for preview lecture modal
  const [selectedPreviewLecture, setSelectedPreviewLecture] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Add state for tracking lecture durations
  const [lectureDurations, setLectureDurations] = useState({});

  // Add check for course owner
  const isCourseOwner = user && course?.owner && user.id === course.owner.id;

  useEffect(() => {
    const fetchOrder = async () => {
      const order = await getOrderByUserIdAndCourseId(user.id, courseId);
      setOrder(order);
    };
    fetchOrder();
  }, [user, courseId]);

  // Check if course is in cart
  const isInCart = cartItems?.courses?.some(
    (cartCourse) => cartCourse.id === parseInt(courseId)
  );

  // Function to collect duration from LectureItem components
  const collectDuration = useCallback((duration, lectureId) => {
    setLectureDurations((prev) => {
      // Skip if we already have this duration
      if (prev[lectureId] && prev[lectureId] > 0) return prev;

      return {
        ...prev,
        [lectureId]: duration,
      };
    });
  }, []);

  // Function to open preview lecture modal
  const openPreviewLecture = (lecture) => {
    if (lecture.preview) {
      setSelectedPreviewLecture(lecture);
      setShowPreviewModal(true);
    }
  };

  // Function to close preview lecture modal
  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setSelectedPreviewLecture(null);
  };

  // Format the duration in a readable way
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0 hours";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
        minutes > 1 ? "s" : ""
      }`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
  };

  // Calculate total course duration when lecture durations change
  useEffect(() => {
    if (!course?.chapters || Object.keys(lectureDurations).length === 0) return;

    let total = 0;
    course.chapters.forEach((chapter) => {
      chapter.lectures.forEach((lecture) => {
        total += lectureDurations[lecture.id] || 0;
      });
    });

    setTotalDuration(formatDuration(total));
  }, [course, lectureDurations]);

  // Hidden component to load all lecture durations
  const LectureDurationLoader = () => {
    if (!course?.chapters) return null;

    return (
      <div style={{ display: "none" }}>
        {course.chapters.flatMap((chapter) =>
          chapter.lectures.map((lecture) => (
            <LectureItem
              key={`duration-${lecture.id}`}
              fileUrl={`${import.meta.env.VITE_LECTURE_URL}/${
                lecture.id
              }/${encodeURIComponent(lecture.file)}`}
              onDurationLoaded={(duration) =>
                collectDuration(duration, lecture.id)
              }
            />
          ))
        )}
      </div>
    );
  };

  // Get a list of all skills from all fields
  const allSkills = course?.fields?.flatMap((field) => field.skills) || [];

  // Function to get an appropriate icon for a field based on its ID or name
  const getFieldIcon = (field) => {
    const fieldName = field.name.toLowerCase();

    // First try to match by field name
    if (fieldName.includes("web"))
      return <FaLaptopCode className="h-5 w-5 text-blue-500" />;
    if (fieldName.includes("mobile"))
      return <FaMobileAlt className="h-5 w-5 text-green-500" />;
    if (fieldName.includes("backend"))
      return <FaServer className="h-5 w-5 text-purple-500" />;
    if (fieldName.includes("database"))
      return <FaDatabase className="h-5 w-5 text-red-500" />;
    if (fieldName.includes("cloud"))
      return <FaCloud className="h-5 w-5 text-sky-500" />;
    if (fieldName.includes("game"))
      return <FaGamepad className="h-5 w-5 text-yellow-500" />;
    if (fieldName.includes("machine") || fieldName.includes("ai"))
      return <FaRobot className="h-5 w-5 text-slate-500" />;
    if (fieldName.includes("data science") || fieldName.includes("analysis"))
      return <FaChartLine className="h-5 w-5 text-green-500" />;
    if (fieldName.includes("iot"))
      return <FaMicrochip className="h-5 w-5 text-pink-500" />;
    if (fieldName.includes("cyber") || fieldName.includes("security"))
      return <FaShieldAlt className="h-5 w-5 text-red-500" />;
    if (
      fieldName.includes("ui") ||
      fieldName.includes("ux") ||
      fieldName.includes("design")
    )
      return <FaPaintBrush className="h-5 w-5 text-indigo-500" />;
    if (fieldName.includes("program") || fieldName.includes("language"))
      return <FaTerminal className="h-5 w-5 text-gray-700" />;
    if (fieldName.includes("test"))
      return <FaBug className="h-5 w-5 text-amber-500" />;

    // Then try to match by ID for backward compatibility
    if (field.id === 1)
      return <FaLaptopCode className="h-5 w-5 text-blue-500" />;
    if (field.id === 2)
      return <FaMobileAlt className="h-5 w-5 text-green-500" />;
    if (field.id === 3) return <FaServer className="h-5 w-5 text-purple-500" />;
    if (field.id === 4) return <FaDatabase className="h-5 w-5 text-red-500" />;
    if (field.id === 5) return <FaCloud className="h-5 w-5 text-sky-500" />;
    if (field.id === 6)
      return <FaPaintBrush className="h-5 w-5 text-indigo-500" />;

    // Default icon if no match
    return <FaCode className="h-5 w-5 text-gray-500" />;
  };

  // Custom CourseContent component with clickable preview lectures
  const CustomCourseContent = ({ course }) => {
    if (!course?.chapters) return <div>Loading content...</div>;

    return (
      <div className="space-y-4">
        <div className="accordion">
          {course.chapters.map((chapter, index) => (
            <div key={index} className="border rounded-md mb-2">
              <div className="p-4 font-semibold bg-slate-50 rounded-t-md">
                <div className="flex justify-between items-center">
                  <span>{chapter.title}</span>
                  <span className="text-sm text-gray-500">
                    {chapter.lectures.length} lectures
                  </span>
                </div>
              </div>
              <div className="divide-y border-t">
                {chapter.lectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className={`flex items-center justify-between p-4 hover:bg-slate-50 ${
                      lecture.preview ? "cursor-pointer" : ""
                    }`}
                    onClick={() =>
                      lecture.preview && openPreviewLecture(lecture)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <FaPlayCircle
                        className={`h-5 w-5 flex-shrink-0 ${
                          lecture.preview ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                      <span>{lecture.title}</span>
                      {lecture.preview && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                          Preview
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      <LectureItem
                        fileUrl={`${import.meta.env.VITE_LECTURE_URL}/${
                          lecture.id
                        }/${lecture?.file}`}
                        onDurationLoaded={(duration) =>
                          collectDuration(duration, lecture.id)
                        }
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Add function to handle unauthenticated actions
  const handleUnauthenticatedAction = () => {
    if (!user) {
      toast.info("Please login to continue", {
        autoClose: 3000,
      });
      navigate("/login", { state: { from: `/course/${courseId}` } });
      return true;
    }
    return false;
  };

  // Modify addToCart handler
  const handleAddToCart = () => {
    if (handleUnauthenticatedAction()) return;
    addToCart(courseId);
  };

  return (
    <div className="flex flex-col min-h-screen items-center">
      {/* Hidden component to preload all lecture durations */}
      <LectureDurationLoader />

      {/* Hero Section with Course Preview */}
      <section className="w-full bg-slate-900 text-white py-12 flex justify-center">
        <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
          <div className="space-y-4 lg:col-span-2">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {course?.title || "Course Title"}
              </h1>
              <p className="text-xl text-slate-200">
                {course?.shortIntroduce || "Course Short Introduction"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isNewCourse(course?.createdAt) && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                >
                  New
                </Badge>
              )}
              <Badge variant="outline" className="bg-slate-800 text-white">
                Updated {course?.updatedAt?.split(" ")[0] || "Recently"}
              </Badge>

              {course?.fields?.map((field) => (
                <Badge
                  key={field.id}
                  variant="outline"
                  className="bg-slate-800 text-white"
                >
                  {field.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-yellow-400 font-bold">
                  {course?.totalRating || 0}
                </span>
                <div className="flex ml-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (course?.totalRating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-slate-300">
                  {course?.totalReviews || 0} reviews
                </span>
              </div>
              <span className="text-slate-300">
                {course?.owner?.totalStudents || 0} students
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">Created by</span>
              <Link
                to={`/instructors/${course?.owner?.id}`}
                className="text-blue-400 hover:underline"
              >
                {course?.owner?.fullName || "Instructor"}
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-1">
                <FaClock className="h-4 w-4" />
                <span>{totalDuration} of content</span>
              </div>
              <div className="flex items-center gap-1">
                <FaFileAlt className="h-4 w-4" />
                <span>{course?.totalLecture || 0} lectures</span>
              </div>
              <div className="flex items-center gap-1">
                <FaGlobe className="h-4 w-4" />
                <span>English</span>
              </div>
              <div className="flex items-center gap-1">
                <FaPlayCircle className="h-4 w-4" />
                <span>{course?.chapters?.length || 0} chapters</span>
              </div>
            </div>
          </div>
          <div className="lg:row-start-1 lg:col-start-3">
            <CoursePreview course={course} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container grid md:grid-cols-3 gap-8 py-12 px-4">
        <div className="md:col-span-2 space-y-8">
          {/* What You'll Learn - Skills */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {allSkills.map((skill, i) => (
                  <div key={i} className="flex gap-2">
                    <FaCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Course Content</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span>
                {course?.totalChapter || 0} sections •{" "}
                {course?.totalLecture || 0} lectures • {totalDuration} of
                content
              </span>
            </div>
            <CustomCourseContent course={course} />
          </div>

          {/* Fields and Skills */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Categories & Skills</h2>
            <div className="space-y-4">
              {course?.fields?.map((field) => (
                <div key={field.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getFieldIcon(field)}
                    <h3 className="text-lg font-medium">{field.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-7">
                    {field.skills.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Description</h2>
            <div
              className={`prose max-w-none ${
                showFullDescription ? "" : "line-clamp-3"
              }`}
            >
              <p>{course?.description || "No description available."}</p>
            </div>
            {course?.description && course.description.length > 150 && (
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Show less" : "Show more"}
              </Button>
            )}
          </div>

          {/* Instructor */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Instructor</h2>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`${import.meta.env.VITE_USER_IMAGE_URL}/${
                    course?.owner?.avatar
                  }`}
                  alt={course?.owner?.fullName}
                />
                <AvatarFallback>
                  {course?.owner?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Link
                  to={`/profile/${course?.owner?.id}`}
                  className="text-xl font-medium hover:underline"
                >
                  {course?.owner?.fullName || "Instructor"}
                </Link>
                <p className="text-muted-foreground">
                  {course?.owner?.bio || "No bio available."}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FaStar className="h-4 w-4 text-yellow-400" />
                    <span>
                      {!isNaN(course?.owner?.totalRating)
                        ? course?.owner?.totalRating.toFixed(1)
                        : 0}{" "}
                      Rating
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUsers className="h-4 w-4" />
                    <span>{course?.owner?.totalStudents || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaPlayCircle className="h-4 w-4" />
                    <span>{course?.owner?.totalCourses || 0} Courses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Student Reviews</h2>
            {course?.reviews?.length > 0 ? (
              <CourseReviews course={course} />
            ) : (
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review this course!
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">
                    {course?.price?.toLocaleString("vi-VN") || 0} VNĐ
                  </span>
                </div>
              </div>

              {isCourseOwner ? (
                // Course owner view
                <>
                  <Button className="w-full text-lg py-6" size="lg" asChild>
                    <Link
                      className="flex items-center justify-center"
                      to={`/instructor/courses`}
                    >
                      <FaPlayCircle className="mr-2 h-5 w-5" />
                      Manage Course
                    </Link>
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    You are the owner of this course
                  </div>
                </>
              ) : order ? (
                // User đã mua khóa học
                <Button className="w-full text-lg py-6" size="lg" asChild>
                  <Link
                    className="flex items-center justify-center"
                    to={`/student/learning-dashboard`}
                  >
                    <FaPlayCircle className="mr-2 h-5 w-5" />
                    Learn Now
                  </Link>
                </Button>
              ) : (
                // User chưa mua khóa học
                <>
                  <Button
                    className="w-full text-lg py-6"
                    size="lg"
                    onClick={() => {
                      if (handleUnauthenticatedAction()) return;
                      navigate(`/student/checkout/${courseId}`);
                    }}
                  >
                    <FaShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isInCart}
                  >
                    {isInCart ? (
                      <>
                        <FaCheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  {isInCart && (
                    <p className="text-sm text-center text-muted-foreground flex items-center justify-center gap-2">
                      <FaCheckCircle className="h-4 w-4 text-green-500" />
                      This course is already in your cart
                    </p>
                  )}
                </>
              )}

              <div className="text-center text-sm text-muted-foreground">
                30-day money-back guarantee
              </div>

              <div className="border-t pt-4">
                <h3 className="font-bold mb-3">This course includes:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <FaPlayCircle className="h-4 w-4 text-primary" />
                    <span>{totalDuration} on-demand video</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaFileAlt className="h-4 w-4 text-primary" />
                    <span>{course?.totalLecture || 0} lectures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaInfinity className="h-4 w-4 text-primary" />
                    <span>Lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaMobileAlt className="h-4 w-4 text-primary" />
                    <span>Access on mobile and TV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaAward className="h-4 w-4 text-primary" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Courses */}
      <section className="container py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
        <RelatedCourses
          currentCourseId={parseInt(courseId)}
          fieldId={
            course?.fields && course.fields[0] ? course.fields[0].id : null
          }
        />
      </section>

      {/* Preview Lecture Modal */}
      {showPreviewModal && selectedPreviewLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">
                {selectedPreviewLecture.title}
              </h3>
              <button
                onClick={closePreviewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <ReactPlayer
                url={`${import.meta.env.VITE_LECTURE_URL}/${
                  selectedPreviewLecture.id
                }/${encodeURIComponent(selectedPreviewLecture.file)}`}
                width="100%"
                height="100%"
                controls
                playing
              />
            </div>
            <div className="p-4">
              <p className="text-gray-700">
                {selectedPreviewLecture.description}
              </p>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={closePreviewModal}
                >
                  Close
                </Button>
                <Button onClick={handleAddToCart}>Add to Cart</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetailPage;
