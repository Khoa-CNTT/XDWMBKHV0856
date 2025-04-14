import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaGraduationCap,
  FaCalendarAlt,
  FaUserGraduate,
} from "react-icons/fa";
import { ReviewModal } from "./ReviewModal";
import { useOrderStore } from "../../../store/useOrderStore";
import { useAuth } from "../../../contexts/AuthContext";

const CoursePurchaseHistory = () => {
  const { user } = useAuth();
  const { orders } = useOrderStore();
  const [myOrders, setMyOrders] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    setMyOrders(orders);
  }, [orders]);

  console.log(myOrders);

  const filteredAndSortedCourses = () => {
    let filtered = [...myOrders];
    switch (sortBy) {
      case "recent":
        return filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "alphabetical":
        return filtered.sort((a, b) =>
          a.course.title.localeCompare(b.course.title)
        );
      default:
        return filtered;
    }
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <h1 className="text-3xl font-bold mb-8">My Course History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCourses().map((myCourse) => {
          const userReview = myCourse.course.reviews?.find(
            (review) => review.user.id === user.id
          );

          return (
            <motion.div
              key={myCourse.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={myCourse.course.image}
                alt={myCourse.course.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {myCourse.course.title}
                </h3>
                <div className="flex items-center mb-2">
                  <FaUserGraduate className="mr-2" />
                  <span>{myCourse.course.owner?.fullName}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="mr-2" />
                  <span>{myCourse.createdAt.split(" ")[0]}</span>
                </div>
                <div className="mt-4">
                  {userReview ? (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={
                            index < userReview.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <p className="ml-2">{userReview.comment}</p>
                    </div>
                  ) : (
                    <button
                      className="text-primary hover:text-primary-dark"
                      onClick={() => {
                        setSelectedCourse(myCourse.course);
                        setIsReviewModalOpen(true);
                      }}
                    >
                      Add Review
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      {isReviewModalOpen && (
        <ReviewModal
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          setIsReviewModalOpen={setIsReviewModalOpen}
          myOrders={myOrders}
          setMyOrders={setMyOrders}
        />
      )}
      {filteredAndSortedCourses().length === 0 && (
        <div className="text-center py-12">
          <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No courses found</p>
        </div>
      )}
    </div>
  );
};

export default CoursePurchaseHistory;
