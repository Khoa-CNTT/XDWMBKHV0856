import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";

export default function RelatedCourses() {
  const scrollRef = useRef(null);

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

  const courses = [
    {
      id: 1,
      title: "Node.js - Building APIs with Express",
      instructor: "John Smith",
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 845,
      price: 59.99,
      originalPrice: 99.99,
      bestseller: true,
    },
    {
      id: 2,
      title: "MongoDB for JavaScript Developers",
      instructor: "Robert Johnson",
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 632,
      price: 49.99,
      originalPrice: 89.99,
      bestseller: false,
    },
    {
      id: 3,
      title: "Advanced Redux - Managing Complex State",
      instructor: "John Smith",
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 421,
      price: 59.99,
      originalPrice: 109.99,
      bestseller: true,
    },
    {
      id: 4,
      title: "TypeScript for React Developers",
      instructor: "Emily Chen",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 567,
      price: 54.99,
      originalPrice: 94.99,
      bestseller: false,
    },
    {
      id: 5,
      title: "Next.js - Building Modern React Applications",
      instructor: "David Wilson",
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 723,
      price: 64.99,
      originalPrice: 114.99,
      bestseller: true,
    },
  ];

  return (
    <div className="relative">
      <div
        className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
        ref={scrollRef}
      >
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-[280px]"
          >
            <Card className="h-full">
              <div className="relative">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="object-cover w-full h-40"
                />
                {course.bestseller && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                  >
                    Bestseller
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold line-clamp-2 h-12">{course.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.instructor}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500 font-bold mr-1">
                    {course.rating}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`h-3 w-3 ${
                          star <= Math.round(course.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({course.reviews})
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold">${course.price}</span>
                  <span className="text-sm line-through text-muted-foreground">
                    ${course.originalPrice}
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
    </div>
  );
}
