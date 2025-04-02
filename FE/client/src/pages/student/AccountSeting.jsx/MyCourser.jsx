import { useState, useEffect, useMemo } from "react";
import { getMyCourse } from "../../../services/ProfileServices/MyCourse.services";
import { getCurrentUser } from "../../../services/auth.services";
import nodata from "../../../assets/images/nodata.png"
const Mycourser = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const coursesPerPage = 4;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const user = await getCurrentUser();
        console.log("Fetched User:", user);

        if (user && user.id) {
          const myCourses = await getMyCourse(user.id);
          console.log("Fetched My Courses:", myCourses);
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

  return (
    <div className="max-w-[950px] rounded-lg  bg-gray-50 dark:bg-gray-900 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading courses...</div>
        ) : courses.length === 0 ? (
          <>
            <img src={nodata} alt="No data" className="w-24 h-16 mx-auto text-gray-400 mb-4" />
            <div className="text-center text-gray-500 dark:text-gray-400">
              No courses available at the moment.
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentCourses.map((course) => (
                <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <img
                    src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{course.owner?.fullName}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-red-500 dark:text-gray-300 font-bold">{course.price}</span>
                      <span className="text-yellow-500">★ {course.rating || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Mycourser;
