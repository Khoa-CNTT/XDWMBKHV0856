import React, { useState, useCallback, useMemo } from "react";
import { FaStar, FaUser } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const reviews = [
    {
        id: 1,
        name: "Thach Dang",
        timeAgo: "2 weeks ago",
        rating: 5,
        comment: "The course is very good.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        rating: 4,
        timeAgo: "1 week ago",
        comment: "Great course overall. The practical examples really helped in understanding complex concepts.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
    },
    {
        id: 3,
        name: "Michael Brown",
        rating: 5,
        timeAgo: "3 days ago",
        comment: "Fantastic learning experience. The instructor was very knowledgeable and engaging.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
    },
    {
        id: 4,
        name: "Emily Davis",
        rating: 4,
        timeAgo: "2 days ago",
        comment: "Very comprehensive course material. Would highly recommend to others.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
    },
    {
        id: 5,
        name: "David Wilson",
        rating: 5,
        timeAgo: "1 day ago",
        comment: "The course provided excellent value for money. Looking forward to more courses.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
    },
    {
        id: 6,
        name: "Lisa Anderson",
        rating: 4,
        timeAgo: "4 hours ago",
        comment: "Well-paced learning experience with great practical applications.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
    },
    {
        id: 7,
        name: "Robert Taylor",
        rating: 5,
        timeAgo: "1 hour ago",
        comment: "The course content was up-to-date and relevant to current industry standards.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9"
    }
];

const CourseReviews = () => {
    const [visibleReviewsCount, setVisibleReviewsCount] = useState(5);
    const [isExpanded, setIsExpanded] = useState(false);

    const visibleReviews = useMemo(() => {
        return reviews.slice(0, visibleReviewsCount);
    }, [visibleReviewsCount]);

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
    }, [isExpanded]);

    const ReviewCard = ({ review }) => (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center mb-4">
                <img
                    src={review.avatar}
                    alt={`${review.name}'s avatar`}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9";
                    }}
                />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{review.name}</h3>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                className={`${index < review.rating ? "text-yellow-400" : "text-gray-300"} w-4 h-4`}
                            />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{review.timeAgo}</span>
                    </div>
                </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
        </div>
    );

    if (!reviews.length) {
        return (
            <div className="text-center py-8">
                <FaUser className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No reviews available yet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-[950px] bg-white rounded-lg shadow py-16 px-4">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Reviews</h2>
                <p className="text-gray-600">
                    {reviews.length} reviews from our students
                </p>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-4 space-y-4 transition-all duration-300 scrollbar-hide">
                {visibleReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
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