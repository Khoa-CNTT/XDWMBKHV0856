import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export default function CourseReviews() {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const reviews = [
    {
      id: 1,
      name: "Robert Johnson",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "04/15/2023",
      comment:
        "The course is very detailed and easy to understand. The instructor explains complex concepts in a simple way. I've learned a lot from this course and have applied it to my real-world projects.",
    },
    {
      id: 2,
      name: "Emily Chen",
      avatar: "/placeholder.svg",
      rating: 4,
      date: "05/22/2023",
      comment:
        "The course content is very good, but I think the Redux section could be explained more thoroughly. However, the practical projects are very useful and helped me understand how to apply React in real-world scenarios.",
    },
    {
      id: 3,
      name: "David Wilson",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "06/10/2023",
      comment:
        "Excellent! I've tried many other React courses but this one is the most understandable. Thank you so much to the instructor.",
    },
    {
      id: 4,
      name: "Sarah Thompson",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "07/05/2023",
      comment:
        "This course has helped me go from a beginner to a confident React developer. The exercises and projects are very practical and useful.",
    },
    {
      id: 5,
      name: "Michael Brown",
      avatar: "/placeholder.svg",
      rating: 4,
      date: "08/18/2023",
      comment:
        "The course content is very comprehensive. I especially liked the section on Hooks and how to use them in real-world situations.",
    },
  ];

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const ratings = {
    5: 75,
    4: 20,
    3: 3,
    2: 1,
    1: 1,
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-5xl font-bold">4.8</span>
            <div className="space-y-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Course Rating
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center w-28">
                  <span>{rating}</span>
                  <FaStar className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                </div>
                <Progress value={ratings[rating]} className="h-2 flex-1" />
                <span className="text-sm text-muted-foreground w-10 text-right">
                  {ratings[rating]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Student Reviews</h3>
          <div className="space-y-4">
            {currentReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.avatar || "/placeholder.svg"}
                      alt={review.name}
                    />
                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{review.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`h-3 w-3 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm">{review.comment}</p>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <FaChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Button variant="outline" className="w-full">
        View All Reviews
      </Button>
    </div>
  );
}
