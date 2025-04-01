import { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuthStore } from "../../../store/useAuthStore";

const Mycourser = () => {
  const { user } = useAuthStore();
  console.log(user);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  const courses = [
    {
      id: 1,
      title: "Advanced React Development",
      instructor: "Sarah Johnson",
      duration: "12 weeks",
      rating: 4.8,
      price: "$99.99",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    },
    {
      id: 2,
      title: "Python for Data Science",
      instructor: "Michael Chen",
      duration: "10 weeks",
      rating: 4.9,
      price: "$89.99",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    },
    {
      id: 3,
      title: "Machine Learning Basics",
      instructor: "Emily Brown",
      duration: "8 weeks",
      rating: 4.7,
      price: "$79.99",
      image: "https://images.unsplash.com/photo-1485796826113-174aa68fd81b",
    },
    {
      id: 4,
      title: "Web Design Fundamentals",
      instructor: "David Wilson",
      duration: "6 weeks",
      rating: 4.6,
      price: "$69.99",
      image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2",
    },
    {
      id: 5,
      title: "JavaScript Mastery",
      instructor: "Alex Turner",
      duration: "10 weeks",
      rating: 4.8,
      price: "$89.99",
      image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a",
    },
    {
      id: 6,
      title: "Mobile App Development",
      instructor: "Lisa Anderson",
      duration: "14 weeks",
      rating: 4.9,
      price: "$109.99",
      image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546",
    },
    {
      id: 7,
      title: "Cloud Computing Essentials",
      instructor: "Robert Smith",
      duration: "8 weeks",
      rating: 4.7,
      price: "$79.99",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    },
    {
      id: 8,
      title: "UI/UX Design Workshop",
      instructor: "Jennifer Lee",
      duration: "6 weeks",
      rating: 4.8,
      price: "$69.99",
      image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634",
    },
  ];

  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const currentCourses = useMemo(() => {
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    return courses.slice(indexOfFirstCourse, indexOfLastCourse);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 ${
            currentPage === i
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          }`}
          aria-label={`Page ${i}`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className=" max-w-[950px] rounded-lg min-h-screen bg-gray-50 dark:bg-gray-900 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"></h1>

        {courses.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No courses available at the moment.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {course.instructor}
                    </p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-red-500 dark:text-gray-300 font-bold">
                        {course.price}
                      </span>
                      <span className="text-yellow-500">★ {course.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-auto dark:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
                aria-label="Previous page"
              >
                <FaChevronLeft className="mr-2" /> Previous
              </button>

              <div className="flex items-center">
                {renderPaginationButtons()}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-auto dark:bg-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
                aria-label="Next page"
              >
                Next <FaChevronRight className="ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Mycourser;
