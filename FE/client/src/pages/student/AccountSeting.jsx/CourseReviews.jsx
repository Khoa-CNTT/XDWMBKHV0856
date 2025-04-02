import React, { useState, useEffect, useCallback } from "react";
import { FaStar } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import nodata from "../../../assets/images/nodata.png"
import { getReview } from "../../../services/ProfileServices/Reviews.serrvices";
import { getCurrentUser } from "../../../services/auth.services";

const CourseReviews = ({ ownerId }) => {
    const [reviews, setReviews] = useState([]);
    const [visibleReviewsCount, setVisibleReviewsCount] = useState(5);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
                const data = await getReview(ownerId || user.id);

                // Sắp xếp đánh giá theo rating từ cao đến thấp
                const sortedReviews = data.sort((a, b) => b.rating - a.rating);

                setReviews(sortedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [ownerId]);

    const handleViewToggle = useCallback(() => {
        setIsExpanded(!isExpanded);
        setVisibleReviewsCount(isExpanded ? 5 : reviews.length);

        if (!isExpanded) {
            setTimeout(() => {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: "smooth"
                });
            }, 100);
        }
    }, [isExpanded, reviews.length]);

    if (loading) {
        return <p className="text-center text-gray-600">Loading reviews...</p>;
    }

    if (!reviews.length) {
        return (
            <div className="">
                <img src={nodata} alt="No data" className="w-24 h-16 mx-auto text-gray-400 mb-4" />
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No review available at the moment.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[950px] rounded-lg  bg-gray-50 dark:bg-gray-900 pb-4 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Reviews</h2>
                <p className="text-gray-600">{reviews.length} reviews from students</p>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-4 space-y-4 transition-all duration-300 scrollbar-hide">
                {reviews.slice(0, visibleReviewsCount).map((review) => (
                    <div key={review.id} className="bg-white rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center mb-4">
                            <img
                                src={review.user.avatar || "https://via.placeholder.com/50"}
                                alt={`${review.user.id}'s avatar`}
                                className="w-12 h-12 rounded-full mr-4 object-cover"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/50";
                                }}
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">User {review.user.id}</h3>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            className={`${index < review.rating ? "text-yellow-400" : "text-gray-300"} w-4 h-4`}
                                        />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">{review.createdAt}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                    </div>
                ))}
            </div>

            {reviews.length > 5 && (
                <button
                    onClick={handleViewToggle}
                    className="mt-6 w-full py-3 px-4 bg-red-500 text-white rounded-lg transition-colors duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                    aria-label={isExpanded ? "Show less reviews" : "View all reviews"}
                >
                    {isExpanded ? (
                        <>
                            Show Less <IoIosArrowUp className="ml-2" />
                        </>
                    ) : (
                        <>
                            View All Reviews <IoIosArrowDown className="ml-2" />
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default CourseReviews;
