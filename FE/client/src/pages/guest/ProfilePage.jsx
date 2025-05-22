import { Link, useParams } from "react-router-dom";
import {
  FaBookOpen,
  FaAward,
  FaClock,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaStar,
  FaHeart,
  FaRegFileAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { FiBarChart2, FiShare2 } from "react-icons/fi";

import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import useFetch from "../../hooks/useFetch";
import React from "react";
import courseDefault from "../../assets/images/course-default.png";
import PrivateProfile from "../../components/Profile/PrivateProfile";

const ProfilePage = () => {
  const { userId } = useParams();
  const { data: user, loading: loadingUser } = useFetch(`/user/${userId}`);

  // Update role check for courses fetch
  const { data: coursesData, loading: loadingCourses } = useFetch(
    ["INSTRUCTOR", "ADMIN", "ROOT"].includes(user?.role)
      ? `/courses?filter=owner.id~'${userId}'`
      : `/orders?filter=buyer.id~'${userId}'`
  );

  // Xử lý dữ liệu khóa học
  const courses = React.useMemo(() => {
    if (!coursesData?.result) return [];

    if (["INSTRUCTOR", "ADMIN", "ROOT"].includes(user?.role)) {
      // Khóa học do giáo viên tạo
      return coursesData?.result.map((course) => ({
        id: course.id,
        title: course.title,
        instructor: course.owner?.fullName || "Instructor",
        image: course.image || "/placeholder.svg",
        students: course.studentQuantity || 0,
        totalLectures:
          course.chapters?.reduce(
            (total, chapter) => total + (chapter.lectures?.length || 0),
            0
          ) || 0,
        category:
          course.fields?.length > 0 ? course.fields[0].name : "Uncategorized",
        rating: course.overallRating || 0,
        price: course.price || 0,
        fields: course.fields || [],
        skills: course.skills || [],
        shortIntroduce: course.shortIntroduce || "",
        status: course.status || "APPROVED",
      }));
    } else {
      // Khóa học mà học viên đã tham gia
      return coursesData?.result
        .map((order) => {
          const course = order.course;
          if (!course) return null;

          // Tính tổng số bài giảng từ các chapter
          const totalLectures =
            course?.chapters?.reduce(
              (total, chapter) => total + (chapter.lectures?.length || 0),
              0
            ) || 0;

          return {
            id: course.id,
            title: course.title,
            instructor: course.owner?.fullName || "Instructor",
            image: course.image || "/placeholder.svg",
            progress: order?.userTotalProcess || 0,
            completedLectures:
              Math.round((order.userTotalProcess / 100) * totalLectures) || 0,
            totalLectures: totalLectures,
            category:
              course.fields?.length > 0
                ? course.fields[0].name
                : "Uncategorized",
            rating: course.overallRating || 0,
            completionDate:
              order?.updatedAt && order?.userTotalProcess === 100
                ? new Date(order.updatedAt).toLocaleDateString()
                : "In progress",
            fields: course.fields || [],
            skills: course.skills || [],
            shortIntroduce: course.shortIntroduce || "",
            status: order?.status || "PENDING",
          };
        })
        .filter(Boolean); // Remove any null entries
    }
  }, [coursesData, user]);

  if (user?.protect) {
    return <PrivateProfile userName={user?.fullName} isCurrentUser={false} />;
  }

  // Dữ liệu đánh giá giả
  const reviews =
    user?.role === "INSTRUCTOR"
      ? [
          // Đánh giá về giáo viên
          {
            id: 1,
            user: "Sarah Adams",
            course: "Web Development With React",
            avatar: "/placeholder.svg",
            rating: 5,
            comment:
              "This course was incredibly helpful! The teacher explains complex concepts in a way that's easy to understand. I learned so much and feel much more confident in my React skills now.",
          },
          {
            id: 2,
            user: "Michael Johnson",
            course: "Node.js - Building APIs with Express",
            avatar: "/placeholder.svg",
            rating: 4,
            comment:
              "Great course on Node.js! The instructor is knowledgeable and explains things clearly. The only reason I'm giving 4 stars instead of 5 is that I wish there were more real-world examples and case studies. Otherwise, highly recommended!",
          },
          {
            id: 3,
            user: "Emily Lewis",
            course: "MongoDB for JavaScript Developers",
            avatar: "/placeholder.svg",
            rating: 5,
            comment:
              "This MongoDB course is fantastic! The instructor does a great job of explaining database concepts and providing practical examples. I went from a complete beginner to being able to build full database applications. Thank you!",
          },
        ]
      : [
          // Đánh giá của học viên
          {
            id: 1,
            course: "Web Development With React",
            instructor: "Jane Doe",
            avatar: "/placeholder.svg",
            rating: 5,
            comment:
              "Excellent course! I learned so much about React and modern web development practices. The instructor explains everything clearly and the projects are very practical.",
            date: "08/15/2023",
          },
          {
            id: 2,
            course: "JavaScript - From Zero to Hero",
            instructor: "Robert Johnson",
            avatar: "/placeholder.svg",
            rating: 4,
            comment:
              "Great course that taught me the fundamentals of JavaScript. The exercises were challenging but helped me learn a lot. Would have liked more advanced topics toward the end.",
            date: "05/12/2023",
          },
        ];

  const loading = loadingUser || loadingCourses;

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <FaUser className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The user profile you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  // Tính toán các thông tin bổ sung dựa trên dữ liệu user
  const userStats = {
    totalCourses: 12,
    completedCourses: 5,
    inProgressCourses: 7,
    totalHoursLearned: 87,
    certificates: 3,
    totalStudents: 2720,
    coursesCreated: 8,
    averageRating: 4.7,
  };

  // Helper function to check if user is a teacher/admin
  const isTeacherOrAdmin = (role) =>
    ["INSTRUCTOR", "ADMIN", "ROOT"].includes(role);

  return (
    <div className="container mx-auto py-8 px-4 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar - User Information */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src={`${import.meta.env.VITE_AVATAR_URL}/${user?.id}/${
                        user?.avatar
                      }`}
                      alt={user.fullName}
                    />
                    <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>

                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <Badge className="mt-2">
                  {user.role === "INSTRUCTOR"
                    ? "Teacher"
                    : user.role === "ADMIN"
                    ? "Administrator"
                    : user.role === "ROOT"
                    ? "Root Admin"
                    : "Student"}
                </Badge>

                <div className="w-full mt-4">
                  <Separator className="my-4" />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <FaCalendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Joined: {user.createdAt.split(" ")[0]}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Email: {user.email}
                      </span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center">
                        <FaPhone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Phone: {user.phone}
                        </span>
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {user.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isTeacherOrAdmin(user.role)
                  ? "Instructor Statistics"
                  : "Learning Statistics"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.role === "STUDENT" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed courses</span>
                    <span className="font-medium">
                      {userStats.completedCourses}/{userStats.totalCourses}
                    </span>
                  </div>
                  <Progress
                    value={
                      (userStats.completedCourses / userStats.totalCourses) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                {isTeacherOrAdmin(user.role) ? (
                  <>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <FaUser className="h-8 w-8 text-primary mb-2" />
                      <span className="text-xl font-bold">
                        {userStats.totalStudents}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Total Students
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <FaBookOpen className="h-8 w-8 text-primary mb-2" />
                      <span className="text-xl font-bold">
                        {userStats.coursesCreated}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Courses Created
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <FaClock className="h-8 w-8 text-primary mb-2" />
                      <span className="text-xl font-bold">
                        {userStats.totalHoursLearned}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Hours Learned
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <FaAward className="h-8 w-8 text-primary mb-2" />
                      <span className="text-xl font-bold">
                        {userStats.certificates}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Certificates
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {user.bio || "No biography provided."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="courses">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <FaBookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isTeacherOrAdmin(user.role) ? "Courses" : "Learning"}
                </span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <FaStar className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {isTeacherOrAdmin(user.role) ? "Reviews" : "My Reviews"}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {isTeacherOrAdmin(user.role)
                    ? `Courses by ${user.fullName}`
                    : `${user.fullName}'s Learning Journey`}
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FiBarChart2 className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                  <Button variant="outline" size="sm">
                    <FaRegFileAlt className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>

              {courses.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {courses.map((course) => (
                    <Card key={`${course.id}`} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-48 h-48 md:h-auto">
                          <img
                            src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${
                              course.id
                            }/${course.image}`}
                            alt={course.title}
                            onError={(e) => {
                              e.target.src = courseDefault;
                            }}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <CardContent className="flex-1 p-6">
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-bold text-lg mb-1">
                                    <Link
                                      to={
                                        isTeacherOrAdmin(user.role)
                                          ? `/course/${course.id}`
                                          : `/course/${course.id}`
                                      }
                                      className="hover:underline"
                                    >
                                      {course.title}
                                    </Link>
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {isTeacherOrAdmin(user.role)
                                      ? `Instructor: ${course.instructor}`
                                      : `Instructor: ${course.instructor}`}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <FaHeart className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <FiShare2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {course.category}
                                </Badge>
                                <div className="flex items-center text-xs">
                                  <FaStar className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                                  <span>{course.rating}</span>
                                </div>
                              </div>

                              {isTeacherOrAdmin(user.role) ? (
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <FaUser className="mr-1 h-3 w-3" />
                                    <span>{course.students} students</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FaBookOpen className="mr-1 h-3 w-3" />
                                    <span>{course.totalLectures} lectures</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-3 mt-2">
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span>Progress</span>
                                      <span>{course.progress}%</span>
                                    </div>
                                    <Progress
                                      value={course.progress}
                                      className="h-2"
                                    />
                                  </div>
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>
                                      {course.completedLectures}/
                                      {course.totalLectures} lectures
                                    </span>
                                    {course.completionDate !== "In progress" ? (
                                      <span>
                                        Completed: {course.completionDate}
                                      </span>
                                    ) : (
                                      <span>In progress</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Fields and Skills Information when viewing a course */}
                              {course.fields && course.fields.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {course.fields.slice(0, 2).map((field) => (
                                    <Badge
                                      key={`field-${field.id}`}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {field.name}
                                    </Badge>
                                  ))}
                                  {course.fields.length > 2 && (
                                    <Badge
                                      key="more-fields"
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{course.fields.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              {/* Course short introduce */}
                              {course.shortIntroduce && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {course.shortIntroduce}
                                </p>
                              )}
                            </div>

                            {isTeacherOrAdmin(user.role) ? (
                              <div className="flex gap-2 pt-4">
                                <span className="text-lg font-bold">
                                  {course.price?.toLocaleString("vi-VN")} VNĐ
                                </span>
                                <div className="flex gap-2 ml-auto">
                                  <Button variant="outline">Add to Cart</Button>
                                  <Button>View Course</Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2 pt-4">
                                <div className="text-sm text-muted-foreground">
                                  {course.completionDate !== "In progress" ? (
                                    <div className="flex items-center">
                                      <FaCheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                      <span>
                                        Completed on: {course.completionDate}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <FaClock className="mr-2 h-4 w-4 text-amber-500" />
                                      <span>
                                        In progress ({course.progress}%
                                        completed)
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 ml-auto">
                                  <Button variant="outline">
                                    View Details
                                  </Button>
                                  {course.status === "PAID" && (
                                    <Button>Continue Learning</Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-muted rounded-lg p-8 text-center">
                  <FaBookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    {isTeacherOrAdmin(user.role)
                      ? "This teacher hasn't created any courses yet."
                      : "This student hasn't enrolled in any courses yet."}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">
                {isTeacherOrAdmin(user.role)
                  ? "Student Reviews"
                  : "My Course Reviews"}
              </h2>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={`review-${review.id}`}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={review.avatar} />
                              <AvatarFallback>
                                {isTeacherOrAdmin(user.role)
                                  ? review.user?.charAt(0)
                                  : review.instructor?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">
                                {isTeacherOrAdmin(user.role)
                                  ? review.user
                                  : review.course}
                              </CardTitle>
                              <CardDescription>
                                {isTeacherOrAdmin(user.role)
                                  ? review.course
                                  : `Instructor: ${review.instructor}`}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={`star-${star}`}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                        {isTeacherOrAdmin(user.role) && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Posted on: {review.date}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-muted rounded-lg p-8 text-center">
                  <FaStar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reviews found</h3>
                  <p className="text-muted-foreground mb-4">
                    {isTeacherOrAdmin(user.role)
                      ? "This teacher hasn't received any reviews yet."
                      : "This student hasn't written any reviews yet."}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
