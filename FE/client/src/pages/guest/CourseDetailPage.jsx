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

function CourseDetailPage() {
  const { courseId } = useParams();

  return (
    <div className="flex flex-col min-h-screen items-center">
      {/* Hero Section with Course Preview */}
      <section className="w-full bg-slate-900 text-white py-12 flex justify-center">
        <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
          <div className="space-y-4 lg:col-span-2">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Web Programming With React - From Basic To Advanced
              </h1>
              <p className="text-xl text-slate-200">
                Learn how to build modern web applications with React, Redux and
                related technologies
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
              >
                Bestseller
              </Badge>
              <Badge variant="outline" className="bg-slate-800 text-white">
                Updated 06/2023
              </Badge>
            </div>

            {/* ... existing code ... */}

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-yellow-400 font-bold">4.8</span>
                <div className="flex ml-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-slate-300">(1,245 reviews)</span>
              </div>
              <span className="text-slate-300">12,345 students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">Created by</span>
              <Link
                to="/instructors/nguyen-van-a"
                className="text-blue-400 hover:underline"
              >
                John Smith
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-1">
                <FaClock className="h-4 w-4" />
                <span>24 hours of content</span>
              </div>
              <div className="flex items-center gap-1">
                <FaChartBar className="h-4 w-4" />
                <span>Level: Intermediate</span>
              </div>
              <div className="flex items-center gap-1">
                <FaGlobe className="h-4 w-4" />
                <span>English</span>
              </div>
              <div className="flex items-center gap-1">
                <FaCommentAlt className="h-4 w-4" />
                <span>Subtitles: Yes</span>
              </div>
            </div>
          </div>
          <div className="lg:row-start-1 lg:col-start-3">
            <CoursePreview />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container grid md:grid-cols-3 gap-8 py-12 px-4">
        <div className="md:col-span-2 space-y-8">
          {/* What You'll Learn */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Deep understanding of React Hooks and how to use them effectively",
                  "Build React applications from start to finish",
                  "Manage state with Redux and Context API",
                  "Create attractive user interfaces with UI libraries",
                  "Optimize performance for React applications",
                  "Deploy React applications to production environments",
                  "Write clean and maintainable code",
                  "Work with REST APIs and GraphQL",
                ].map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <FaCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Course Content</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span>24 sections • 148 lectures • 24 hours of content</span>
              <Button variant="link" className="p-0 h-auto font-semibold">
                Expand all sections
              </Button>
            </div>
            <CourseContent />
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Requirements</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Basic knowledge of HTML, CSS, and JavaScript</li>
              <li>Understanding of ES6+ is an advantage</li>
              <li>
                No prior experience with React or any JavaScript framework
                needed
              </li>
              <li>Computer with Node.js installed</li>
            </ul>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Description</h2>
            <div className="prose max-w-none">
              <p>
                React is one of the most popular JavaScript libraries for
                building user interfaces. Developed and maintained by Facebook,
                React has become the top choice for web developers worldwide.
              </p>
              <p>
                In this course, you will learn how to build modern web
                applications with React from basic to advanced. We will start
                with fundamental concepts and gradually progress to advanced
                techniques.
              </p>
              <p>
                You will build several real-world projects throughout the
                course, including:
              </p>
              <ul>
                <li>Task management application</li>
                <li>E-commerce application</li>
                <li>Simple social network</li>
                <li>Blog application with CMS</li>
              </ul>
              <p>
                Each project will help you reinforce your knowledge and build an
                impressive portfolio for job hunting.
              </p>
              <p>
                This course not only teaches you how to use React but also helps
                you understand how React works internally, making you a better
                React developer.
              </p>
            </div>
            <Button variant="link" className="p-0 h-auto font-semibold">
              Show more
            </Button>
          </div>

          {/* Instructor */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Instructor</h2>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt="John Smith" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Link
                  to="/instructors/nguyen-van-a"
                  className="text-xl font-medium hover:underline"
                >
                  John Smith
                </Link>
                <p className="text-muted-foreground">
                  React Expert with 8 years of experience
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FaStar className="h-4 w-4 text-yellow-400" />
                    <span>4.8 Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUsers className="h-4 w-4" />
                    <span>45,678 Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaPlayCircle className="h-4 w-4" />
                    <span>12 Courses</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="prose max-w-none">
              <p>
                John Smith is a React expert with over 8 years of experience in
                web development. He has worked with many large companies and
                startups, helping them build complex and high-performance web
                applications.
              </p>
              <p>
                With over 5 years of teaching experience, he has helped more
                than 45,000 students worldwide learn React and find jobs in the
                web development field.
              </p>
            </div>
            <Button variant="link" className="p-0 h-auto font-semibold">
              Show more
            </Button>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Student Reviews</h2>
            <CourseReviews />
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
                      <span className="text-3xl font-bold">$59.99</span>
                      <span className="text-lg line-through text-muted-foreground">
                        $119.99
                      </span>
                    </div>
                    <span className="text-red-500">
                      🔥 50% off - 2 days left
                    </span>
                  </div>
                  <Button className="w-full text-lg py-6" size="lg">
                    <FaShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add to Cart
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    30-day money-back guarantee
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold">This course includes:</h3>
                    <ul className="space-y-2">
                      {[
                        {
                          icon: <FaPlayCircle className="h-4 w-4" />,
                          text: "24 hours on-demand video",
                        },
                        {
                          icon: <FaFileAlt className="h-4 w-4" />,
                          text: "25 exercises and projects",
                        },
                        {
                          icon: <FaDownload className="h-4 w-4" />,
                          text: "76 downloadable resources",
                        },
                        {
                          icon: <FaInfinity className="h-4 w-4" />,
                          text: "Lifetime access",
                        },
                        {
                          icon: <FaMobileAlt className="h-4 w-4" />,
                          text: "Access on mobile and TV",
                        },
                        {
                          icon: <FaAward className="h-4 w-4" />,
                          text: "Certificate of completion",
                        },
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button variant="ghost" size="sm">
                      <FaShareAlt className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FaHeart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Button>
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
        <RelatedCourses />
      </section>
    </div>
  );
}

export default CourseDetailPage;
