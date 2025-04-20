import { motion } from "framer-motion";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { createReview } from "../../../services/review.services";
import { useAuth } from "../../../contexts/AuthContext";
import { useMyOrder } from "../../../contexts/MyOrderContext";

export const ReviewModal = ({
  selectedCourse,
  setSelectedCourse,
  setIsReviewModalOpen,
}) => {
  const { user } = useAuth();
  const { refetchMyOrders } = useMyOrder();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleReviewSubmit = async () => {
    if (selectedCourse && rating > 0) {
      // Gửi review lên server
      await createReview({
        user: { id: user.id },
        course: { id: selectedCourse.id },
        rating,
        comment: reviewText,
      });

      await refetchMyOrders();
      // Reset và đóng modal
      setIsReviewModalOpen(false);
      setSelectedCourse(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-semibold mb-4">Review Course</h3>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer ${
                star <= (hoveredRating || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          rows="4"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md"
            onClick={() => setIsReviewModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={handleReviewSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </motion.div>
  );
};
