import React, { useState, useEffect } from "react";
import CourseDetailModal from "../../components/teacher/CourseDetailModal";
import fakeDataCourse from "../../components/teacher/fakedata/fakeDataCourse";
import ToggleSwitch from "../../components/teacher/ToggleSwitch";
import CourseAddModal from "../../components/teacher/CourseAddModal";
// import CourseEditModal from "../../components/teacher/CourseEditModal"; // Import CourseEditModal
import { getCourseById } from "../../services/course.services";
import { getCurrentUser } from "../../services/auth.services";
import { getPaidOrdersByCourseId } from "../../services/order.services";
import { getReviewCourseId } from "../../services/ProfileServices/Reviews.serrvices";
import { toggleCourseActive } from "../../services/course.services";
import loading from "../../assets/images/loading.gif";
import CourseEditModal from "../../components/teacher/editCouse/CourseEditModal";

const CourseManagement = () => {
  const [courses, setCourses] = useState(fakeDataCourse);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingActiveId, setLoadingActiveId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null); // State to manage editing course

  // Lấy thông tin user hiện tại
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user.id);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userId) return;
      try {
        const courseData = await getCourseById(userId);

        const coursesWithExtras = await Promise.all(
          courseData.result.map(async (course) => {
            let students = 0;
            let rating = 0;

            try {
              const orders = await getPaidOrdersByCourseId(course.id);
              students = orders?.length || 0;
            } catch (error) {
              console.error(`Lỗi lấy đơn hàng của course ${course.id}:`, error);
            }

            try {
              const reviews = await getReviewCourseId(course.id);
              if (reviews?.length > 0) {
                const totalRating = reviews.reduce(
                  (sum, r) => sum + r.rating,
                  0
                );
                rating = (totalRating / reviews.length).toFixed(1);
              }
            } catch (error) {
              console.error(`Lỗi lấy đánh giá của course ${course.id}:`, error);
            }

            return {
              ...course,
              students,
              rating,
            };
          })
        );

        setCourses(coursesWithExtras);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khóa học:", error);
      }
    };

    fetchCourses();
  }, [userId]);

  const handleEdit = (course) => {
    console.log("Course ID being edited:", course.id); // In ra id của khóa học khi nhấn Edit
    setEditingCourse(course); // Set the course to be edited
  };

  const handleDelete = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleToggleActive = async (courseId) => {
    if (loadingActiveId === courseId) return;

    setLoadingActiveId(courseId);

    try {
      const updatedCourse = await toggleCourseActive(courseId);

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? { ...course, active: updatedCourse.active }
            : course
        )
      );
    } catch (error) {
      console.error("Failed to toggle course active:", error);
    } finally {
      setTimeout(() => {
        setLoadingActiveId(null);
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Course Management
      </h1>
      <button
        onClick={handleAddNew}
        className="mb-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
      >
        Add New Course
      </button>
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Students
              </th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Active
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  {course.title}
                </td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  <img
                    src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${course.id
                      }/${course.image}`}
                    alt={course.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                </td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  {course.students}
                </td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  {course.rating}
                </td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${course.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(course)} // Trigger Edit
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setViewingCourse(course)}
                      className="text-green-500 hover:text-green-700"
                    >
                      View
                    </button>
                  </div>
                </td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  {loadingActiveId === course.id ? (
                    <img
                      src={loading}
                      alt="Loading..."
                      className="h-8 w-8 mx-auto"
                    />
                  ) : (
                    <ToggleSwitch
                      checked={course.active}
                      onChange={() => handleToggleActive(course.id)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <CourseAddModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newCourse) => setCourses([...courses, newCourse])}
        />
      )}
      {viewingCourse && (
        <CourseDetailModal
          course={viewingCourse}
          onClose={() => setViewingCourse(null)}
        />
      )}
      {editingCourse && (
        <CourseEditModal
          courseId={editingCourse.id}
          onClose={() => setEditingCourse(null)}
          onSave={(updatedCourse) => {
            setCourses((prevCourses) =>
              prevCourses.map((course) =>
                course.id === updatedCourse.id ? updatedCourse : course
              )
            );
            setEditingCourse(null);
          }}
        />
      )}
    </div>
  );
};

export default CourseManagement;
