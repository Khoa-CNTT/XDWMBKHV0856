import { useState, useEffect, useMemo } from "react";
import { getMyCourse } from "../../../services/ProfileServices/MyCourse.services";
import { getCurrentUser } from "../../../services/auth.services";
import nodata from "../../../assets/images/nodata.png";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { FiSettings } from "react-icons/fi";

const Mycourser = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const coursesPerPage = 4;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const user = await getCurrentUser();

        if (user && user.id) {
          const myCourses = await getMyCourse(user.id);
          setCourses(myCourses.result || []);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const currentCourses = useMemo(() => {
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    return courses.slice(indexOfFirstCourse, indexOfLastCourse);
  }, [currentPage, courses]);

  // Chuyển đến trang tiếp theo
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Chuyển đến trang trước
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Chuyển đến trang cụ thể
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-[950px] rounded-lg bg-gray-50 dark:bg-gray-900 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <>
            <img
              src={nodata}
              alt="No data"
              className="w-24 h-16 mx-auto text-gray-400 mb-4"
            />
            <div className="text-center text-gray-500 dark:text-gray-400">
              No courses available at the moment.
            </div>
          </>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-900 mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Thumbnail
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Course Name
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Students
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                  {currentCourses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-4 py-3">
                        <img
                          src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${
                            course.id
                          }/${course.image}`}
                          alt={course.title}
                          className="w-14 h-14 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        <span
                          className="block max-w-[200px] truncate"
                          title={course.title}
                        >
                          {course.title}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            course.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : course.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : course.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {course.students || 0}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {course.revenue ? course.revenue.toLocaleString() : 0}₫
                      </td>
                      <td className="px-4 py-3 text-center">
                        {course.createdAt
                          ? new Date(course.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full"
                          title="Manage Course"
                          onClick={() =>
                            (window.location.href = `/instructor/courses`)
                          }
                        >
                          <FiSettings className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              {/* Previous Button */}
              <button
                onClick={prevPage}
                className="px-4 py-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition duration-150 ease-in-out flex items-center justify-center"
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              {/* Page Number Buttons */}
              <div className="flex items-center space-x-2">
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page + 1)}
                    className={`px-4 py-2 ${
                      currentPage === page + 1
                        ? "bg-red-600 text-white"
                        : "bg-gray-200"
                    } rounded-full hover:bg-red-400 transition duration-150 ease-in-out`}
                  >
                    {page + 1}
                  </button>
                ))}
              </div>
              {/* Next Button */}
              <button
                onClick={nextPage}
                className="px-4 py-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition duration-150 ease-in-out flex items-center justify-center"
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Mycourser;
