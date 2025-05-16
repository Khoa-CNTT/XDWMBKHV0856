import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { getReviews } from "../../services/review.services";
import { formatDate } from "../../utils/formatDateTime";

export default function CourseReviews({ course }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const reviewsPerPage = 3;
  console.log(course);

  // Tạo phân phối rating (mặc định là 0% cho mỗi mức rating)
  const calculateRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (course?.reviews && course.reviews.length > 0) {
      // Đếm số lượng mỗi rating
      course.reviews.forEach((review) => {
        if (distribution[review.rating] !== undefined) {
          distribution[review.rating]++;
        }
      });

      // Chuyển đổi thành phần trăm
      const totalReviews = course.reviews.length;
      Object.keys(distribution).forEach((rating) => {
        distribution[rating] = Math.round(
          (distribution[rating] / totalReviews) * 100
        );
      });
    }

    return distribution;
  };

  const ratingDistribution = calculateRatingDistribution();

  useEffect(() => {
    const fetchReviews = async () => {
      // Nếu course đã có reviews, sử dụng chúng thay vì gọi API
      if (course?.reviews && course.reviews.length > 0) {
        setReviews(course.reviews);
        return;
      }

      // Nếu không, gọi API để lấy reviews
      if (course?.id) {
        setLoading(true);
        try {
          const response = await getReviews({
            filter: `course.id~'${course.id}'`,
            page: currentPage,
            size: reviewsPerPage,
          });

          if (response && Array.isArray(response)) {
            setReviews(response);
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReviews();
  }, [currentPage, course?.id, course?.reviews]);

  const totalReviews = course?.totalReviews || 0;
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-5xl font-bold">{course?.totalRating}</span>
            <div className="space-y-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`h-5 w-5 ${
                      star <= course?.totalRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
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
                <Progress
                  value={ratingDistribution[rating]}
                  className="h-2 flex-1"
                />
                <span className="text-sm text-muted-foreground w-10 text-right">
                  {ratingDistribution[rating]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Student Reviews</h3>
          {loading ? (
            <div className="text-center py-8">Loading reviews...</div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
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
                        src={
                          review.user?.avatar
                            ? `/uploads/${review.user.avatar}`
                            : "/placeholder.svg"
                        }
                        alt={review.user?.fullName || "User"}
                      />
                      <AvatarFallback>
                        {review.user?.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {review.user?.fullName || "Anonymous"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span>
                          {review.createdAt
                            ? formatDate(review.createdAt)
                            : "Unknown date"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No reviews yet for this course.
            </div>
          )}

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

      {totalReviews > reviewsPerPage && (
        <Button variant="outline" className="w-full">
          View All Reviews
        </Button>
      )}
    </div>
  );
}
