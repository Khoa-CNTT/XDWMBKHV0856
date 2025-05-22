import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaGraduationCap,
  FaCalendarAlt,
  FaUserGraduate,
} from "react-icons/fa";
import { ReviewModal } from "./ReviewModal";
import { useMyOrder } from "../../../contexts/MyOrderContext";

const CoursePurchaseHistory = () => {
  const { myOrders } = useMyOrder();
  console.log("myOrders", myOrders);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background py-6">
      <h1 className="text-3xl font-bold mb-8">Purchased course</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myOrders.map((myOrder) => {
          return (
            <motion.div
              key={myOrder.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${myOrder.course.id
                  }/${myOrder.course.image}`}
                alt={myOrder.course.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {myOrder.course.title}
                </h3>
                <div className="flex items-center mb-2">
                  <FaUserGraduate className="mr-2" />
                  <span>{myOrder.course.owner?.fullName}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="mr-2" />
                  <span>{myOrder.createdAt.split(" ")[0]}</span>
                </div>
                <div className="mt-4">
                  {myOrder.userReview ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className={
                              index < myOrder.userReview.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <p className="ml-2">{myOrder.userReview.comment}</p>
                    </div>
                  ) : (
                    <button
                      className="text-primary hover:text-primary-dark"
                      onClick={() => {
                        setSelectedCourse(myOrder.course);
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
        />
      )}
      {myOrders.length === 0 && (
        <div className="text-center py-12">
          <FaGraduationCap className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No courses found</p>
        </div>
      )}
    </div>
  );
};

export default CoursePurchaseHistory;
