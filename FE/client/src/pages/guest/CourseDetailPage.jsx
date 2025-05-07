import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaClock,
  FaGlobe,
  FaPlayCircle,
  FaAward,
  FaChartBar,
  FaCommentAlt,
  FaShareAlt,
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaUsers,
  FaFileAlt,
  FaDownload,
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
} from "react-icons/fa";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import CourseContent from "../../components/CourseDetails/CourseContent";
import CourseReviews from "../../components/CourseDetails/CourseReviews";
import RelatedCourses from "../../components/CourseDetails/RelatedCourses";
import CoursePreview from "../../components/CourseDetails/CoursePreview";
import useFetch from "../../hooks/useFetch";
import { isNewCourse } from "../../utils/courseUtils";
import { useCart } from "../../contexts/CartContext";
import { useState, useEffect } from "react";

function CourseDetailPage() {
  const { courseId } = useParams();
  const { addToCart } = useCart();
  const { data: course } = useFetch(`course-details/${courseId}`);
  const [totalDuration, setTotalDuration] = useState("0 hours");
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    // This would be replaced with real video duration calculation
    // For now we'll estimate based on lectures
    if (course?.totalLecture) {
      // Assuming average 15 minutes per lecture
      const totalMinutes = course.totalLecture * 15;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      if (hours > 0 && minutes > 0) {
        setTotalDuration(
          `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
            minutes > 1 ? "s" : ""
          }`
        );
      } else if (hours > 0) {
        setTotalDuration(`${hours} hour${hours > 1 ? "s" : ""}`);
      } else {
        setTotalDuration(`${minutes} minute${minutes > 1 ? "s" : ""}`);
      }
    }
  }, [course]);

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

  return (
    <div className="flex flex-col min-h-screen items-center">
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
              <Button variant="link" className="p-0 h-auto font-semibold">
                Expand all sections
              </Button>
            </div>
            <CourseContent course={course} />
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
                  to={`/instructors/${course?.owner?.id}`}
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
                        ? course?.owner?.totalRating
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
            <CardContent className="p-0">
              <Tabs defaultValue="buy">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="buy">Buy Course</TabsTrigger>
                  <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">
                        {course?.price?.toLocaleString("vi-VN") || 0} VNĐ
                      </span>
                    </div>
                  </div>
                  <Button className="w-full text-lg py-6" size="lg">
                    <Link
                      className="flex items-center"
                      to={`/student/checkout/${courseId}`}
                    >
                      <FaShoppingCart className="mr-2 h-5 w-5" />
                      Buy Now
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => addToCart(courseId)}
                  >
                    Add to Cart
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    30-day money-back guarantee
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold">This course includes:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <FaPlayCircle className="h-4 w-4" />
                        <span>{totalDuration} on-demand video</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FaFileAlt className="h-4 w-4" />
                        <span>{course?.totalLecture || 0} lectures</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FaInfinity className="h-4 w-4" />
                        <span>Lifetime access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FaMobileAlt className="h-4 w-4" />
                        <span>Access on mobile and TV</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FaAward className="h-4 w-4" />
                        <span>Certificate of completion</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="subscribe" className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Unlimited Access</h3>
                    <p className="text-muted-foreground">
                      Subscribe to Premium to access all courses
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold">$14.99</span>
                      <span>/month</span>
                    </div>
                    <span className="text-green-500">
                      Includes 7-day free trial
                    </span>
                  </div>
                  <Button className="w-full text-lg py-6" size="lg">
                    Start Free Trial
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Cancel anytime
                  </div>
                </TabsContent>
              </Tabs>
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
    </div>
  );
}

export default CourseDetailPage;
