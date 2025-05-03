import React, { useState, useEffect } from "react";
import ToggleSwitch from "../../components/teacher/ToggleSwitch";
import CourseAddModal from "../../components/teacher/CourseAddModal";
import { getCourseById } from "../../services/course.services";
import { getCurrentUser } from "../../services/auth.services";
import { getPaidOrdersByCourseId } from "../../services/order.services";
import { getReviewCourseId } from "../../services/ProfileServices/Reviews.serrvices";
import { toggleCourseActive, deleteCourse } from "../../services/course.services";
import loading from "../../assets/images/loading.gif";
import CourseEditModal from "../../components/teacher/editCouse/CourseEditModal";

const CourseManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingActiveId, setLoadingActiveId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterActive, setFilterActive] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

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
      setIsLoading(true);

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
                const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  const handleEdit = (course) => {
    setEditingCourse(course);
  };

  const handleDelete = (course) => {
    setCourseToDelete(course);  // Lưu thông tin khóa học cần xóa
    setShowDeleteModal(true);  // Hiển thị modal xác nhận
  };

  const handleConfirmDelete = async () => {
    try {
      if (!courseToDelete) return;

      await deleteCourse(courseToDelete.id);
      setCourses(courses.filter((course) => course.id !== courseToDelete.id));
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
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
          course.id === courseId ? { ...course, active: updatedCourse.active } : course
        )
      );
    } catch (error) {
      console.error("Failed to toggle course active:", error);
    } finally {
      setTimeout(() => setLoadingActiveId(null), 2000);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const filteredCourses = courses.filter((course) => {
    const matchesStatus =
      filterStatus === "All" || course.status === filterStatus.toUpperCase();
    const matchesActive =
      filterActive === "All" || course.active === (filterActive === "Active");
    const matchesSearch =
      searchTerm.trim() === "" ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesActive && matchesSearch;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (typeof aVal === "string") {
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Course Management</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <button
          onClick={handleAddNew}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
        >
          Add New Course
        </button>

        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value="All">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value="All">All Active</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/3"
        />
      </div>

      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {[{ label: "Title", key: "title" }, { label: "Image" }, { label: "Students", key: "students" }, { label: "Rating", key: "rating" }, { label: "Status", key: "status" }, { label: "Actions" }, { label: "Active", key: "active" }].map(({ label, key }) => (
                <th
                  key={label}
                  onClick={key ? () => handleSort(key) : undefined}
                  className={`px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${key ? "cursor-pointer" : ""}`}
                >
                  {label}
                  {key && (sortConfig.key === key ? <span className="ml-1 text-red-500">{sortConfig.direction === "asc" ? "▲" : "▼"}</span> : <span className="ml-1 text-red-500">⇅</span>)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedCourses.map((course) => (
              <tr key={course.id}>
                <td className="px-5 py-5 border-b bg-white text-sm">{course.title}</td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  <img
                    src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${course.id}/${course.image}`}
                    alt={course.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                </td>
                <td className="px-5 py-5 border-b bg-white text-sm">{course.students}</td>
                <td className="px-5 py-5 border-b bg-white text-sm">{course.rating}</td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${course.status === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : course.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(course)} className="text-blue-500 hover:text-blue-700">Edit</button>
                    <button onClick={() => handleDelete(course)} className="text-red-500 hover:text-red-700">Delete</button>
                  </div>
                </td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  {loadingActiveId === course.id ? (
                    <img src={loading} alt="Loading..." className="h-8 w-8 mx-auto" />
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
      {editingCourse && (
        <CourseEditModal
          courseId={editingCourse.id}
          onClose={() => setEditingCourse(null)}
          onSave={(updatedCourse) => {
            setCourses((prevCourses) =>
              prevCourses.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
            );
            setEditingCourse(null);
          }}
        />
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Are you sure you want to delete this course?</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-around gap-4">
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out transform hover:scale-105"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition duration-150 ease-in-out transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
