import React, { useState, useEffect } from "react";
import CourseDetailModal from "../../components/teacher/CourseDetailModal";
import fakeDataCourse from "../../components/teacher/fakedata/fakeDataCourse";
import ToggleSwitch from "../../components/teacher/ToggleSwitch";
import CourseAddModal from "../../components/teacher/CourseAddModal";
import { getCourseById } from "../../services/course.services";
import { getCurrentUser } from "../../services/auth.services";
import { getPaidOrdersByCourseId } from "../../services/order.services";
import { getReviewCourseId } from "../../services/ProfileServices/Reviews.serrvices";

const CourseManagement = () => {
  const [courses, setCourses] = useState(fakeDataCourse);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [imageCourse, setImageCourse] = useState("default-avatar.jpg");

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
      }
    };

    fetchCourses();
  }, [userId]);


  const handleEdit = (course) => {
    setEditingCourse({ ...course });
    setImageCourse(`${import.meta.env.VITE_COURSE_IMAGE_URL}/${course.id}/${course.image}`);
  };

  const handleDelete = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const handleSave = () => {
    if (editingCourse.id) {
      setCourses(
        courses.map((course) =>
          course.id === editingCourse.id ? editingCourse : course
        )
      );
    } else {
      setCourses([...courses, { ...editingCourse, id: Date.now() }]);
    }
    setEditingCourse(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setEditingCourse((prev) => ({
        ...prev,
        image: imageURL,
        imageFile: file,
      }));
      setImageCourse(imageURL);
    }
  };


  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleToggleActive = (courseId) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, active: !course.active } : course
      )
    );
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
                    src={`${import.meta.env.VITE_COURSE_IMAGE_URL}/${course.id}/${course.image}`}
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
                      onClick={() => handleEdit(course)}
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
                  <ToggleSwitch
                    checked={course.active}
                    onChange={() => handleToggleActive(course.id)}
                  />
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-4xl p-6 rounded-lg shadow-lg relative">
            <h3 className="text-2xl font-semibold mb-4">
              {editingCourse.id ? "Edit Course" : "Add New Course"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={editingCourse.title}
                  onChange={handleChange}
                  placeholder="Course Title"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Number of Students
                </label>
                <input
                  type="number"
                  name="students"
                  value={editingCourse.students}
                  onChange={handleChange}
                  placeholder="Number of Students"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={editingCourse.rating}
                  onChange={handleChange}
                  placeholder="Rating"
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editingCourse.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Course Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                {editingCourse.image && (
                  <img
                    src={editingCourse.image}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded shadow"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingCourse(null)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingCourse && (
        <CourseDetailModal
          course={viewingCourse}
          onClose={() => setViewingCourse(null)}
        />
      )}
    </div>
  );
};

export default CourseManagement;
