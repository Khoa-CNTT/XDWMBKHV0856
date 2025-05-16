import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { FaPlayCircle, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getOrderByUserIdAndCourseId } from "../../services/order.services";
import { useCart } from "../../contexts/CartContext";

export default function CoursePreview({ course }) {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const [order, setOrder] = useState(null);
  const [isCourseOwner, setIsCourseOwner] = useState(false);

  // Check if course is in cart
  const isInCart = cartItems?.courses?.some(
    (cartCourse) => cartCourse.id === course?.id
  );

  useEffect(() => {
    // Check if user is course owner
    if (user && course?.owner) {
      setIsCourseOwner(user.id === course.owner.id);
    }

    // Fetch order if user exists
    const fetchOrder = async () => {
      if (user) {
        const order = await getOrderByUserIdAndCourseId(user.id, course?.id);
        setOrder(order);
      }
    };
    fetchOrder();
  }, [user, course]);

  const renderActionButton = () => {
    if (isCourseOwner) {
      return (
        <Link
          className="flex items-center justify-center w-full py-2 text-white bg-primary rounded-md hover:opacity-80 transition duration-200"
          to="/instructor/courses"
        >
          <FaPlayCircle className="mr-2 h-5 w-5" />
          Manage Course
        </Link>
      );
    }

    if (order) {
      return (
        <Link
          className="flex items-center justify-center w-full py-2 text-white bg-primary rounded-md hover:opacity-80 transition duration-200"
          to="/student/learning-dashboard"
        >
          <FaPlayCircle className="mr-2 h-5 w-5" />
          Learn Now
        </Link>
      );
    }

    return (
      <>
        <Link
          className="flex items-center justify-center w-full py-2 text-white bg-primary rounded-md hover:opacity-80 transition duration-200 mb-2"
          to={`/student/checkout/${course?.id}`}
        >
          <FaShoppingCart className="mr-2 h-5 w-5" />
          Buy Now
        </Link>
        <button
          onClick={() => addToCart(course?.id)}
          disabled={isInCart}
          className={`flex items-center justify-center w-full py-2 border rounded-md transition duration-200 ${
            isInCart
              ? "bg-green-50 text-green-600 border-green-200"
              : "hover:bg-gray-50"
          }`}
        >
          {isInCart ? (
            <>
              <FaCheckCircle className="mr-2 h-5 w-5" />
              Added to Cart
            </>
          ) : (
            <>
              <FaShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </button>
      </>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 flex flex-col items-center justify-center">
        <div className="w-full h-40">
          <img
            src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${course?.id}/${
              course?.image
            }`}
            alt="Course preview"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4 space-y-4 w-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">
                {course?.price?.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>
          {renderActionButton()}
          {isCourseOwner && (
            <div className="text-center text-sm text-muted-foreground">
              You are the owner of this course
            </div>
          )}
          {!isCourseOwner && (
            <div className="text-center text-sm text-muted-foreground">
              30-day money-back guarantee
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
