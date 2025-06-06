import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { getCourses } from "../../services/course.services";
import { isNewCourse } from "../../utils/courseUtils";

export default function RelatedCourses({ currentCourseId, fieldId }) {
  const scrollRef = useRef(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch courses with the same field if fieldId is provided
        let filter = fieldId ? `fields.id~'${fieldId}'` : "";
        const response = await getCourses({ filter, size: 10 });

        if (response && Array.isArray(response.result)) {
          // Filter out the current course and only show approved & active courses
          const filteredCourses = response.result.filter(
            (course) =>
              course.id !== currentCourseId &&
              course.status === "APPROVED" &&
              course.active === true
          );

          setRelatedCourses(filteredCourses);
        } else if (response && Array.isArray(response)) {
          // Backward compatibility if API returns array directly
          const filteredCourses = response.filter(
            (course) =>
              course.id !== currentCourseId &&
              course.status === "APPROVED" &&
              course.active === true
          );
          setRelatedCourses(filteredCourses);
        }
      } catch (error) {
        console.error("Error fetching related courses:", error);
        setError(error.message || "Failed to load related courses");

        // If error occurs, try without filter
        try {
          const allResponse = await getCourses({ size: 10 });
          if (allResponse && Array.isArray(allResponse.result)) {
            const filteredCourses = allResponse.result.filter(
              (course) =>
                course.id !== currentCourseId &&
                course.status === "APPROVED" &&
                course.active === true
            );
            setRelatedCourses(filteredCourses);
            setError(null);
          } else if (allResponse && Array.isArray(allResponse)) {
            const filteredCourses = allResponse.filter(
              (course) =>
                course.id !== currentCourseId &&
                course.status === "APPROVED" &&
                course.active === true
            );
            setRelatedCourses(filteredCourses);
            setError(null);
          }
        } catch (fallbackError) {
          console.error("Error in fallback fetch:", fallbackError);
          setError("Unable to load related courses. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedCourses();
  }, [currentCourseId, fieldId]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Display loading, error, or no courses message
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-blue-500 hover:text-blue-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (relatedCourses.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">No related courses found.</div>
        <div className="text-sm text-gray-400">
          Try exploring our course catalog for more options.
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
        ref={scrollRef}
      >
        {relatedCourses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-[280px]"
          >
            <Card className="h-full flex flex-col justify-between">
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${course.id}/${
                    course.image
                  }`}
                  alt={course.title}
                  className="object-cover w-full h-40"
                />
                {isNewCourse(course.createdAt) && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                  >
                    New
                  </Badge>
                )}
                <CardContent className="p-4">
                  <h3 className="font-bold line-clamp-2 h-12">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.owner?.fullName || "Unknown Instructor"}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {course.fields?.map((field) => (
                      <Badge
                        key={field.id}
                        variant="secondary"
                        className="bg-primary/10 text-primary text-xs"
                      >
                        {field.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {course.skills?.slice(0, 2).map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="outline"
                        className="text-xs border-muted-foreground/20"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                    {course.skills?.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-muted-foreground/20"
                      >
                        +{course.skills.length - 2} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 font-bold mr-1">
                      {course.overallRating || 0}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`h-3 w-3 ${
                            star <= Math.round(course.overallRating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({course.studentQuantity || 0} students)
                    </span>
                  </div>
                </CardContent>
              </div>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    {course.price?.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <Link to={`/courses/${course.id}`}>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {relatedCourses.length > 3 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-background shadow-md rounded-full h-10 w-10"
            onClick={scrollLeft}
          >
            <FaChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-background shadow-md rounded-full h-10 w-10"
            onClick={scrollRight}
          >
            <FaChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
}
