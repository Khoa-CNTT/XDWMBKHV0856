import React, { useState } from "react";
import CourseDetailModal from "../../components/teacher/CourseDetailModal";

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React Basics",
      image: "https://placehold.co/100x100",
      students: 50,
      rating: 4.5,
      status: "Published",
      active: true,
      sections: [
        {
          title: "Introduction",
          lessons: [
            {
              title: "What is React?",
              description: "An overview of React.js library",
              price: 100,
            },
            {
              title: "Setup Environment",
              description: "Tools and setup needed for React development",
              price: 0,
            },
          ],
        },
        {
          title: "Core Concepts",
          lessons: [
            {
              title: "Components",
              description: "Understanding functional and class components",
              price: 10,
            },
            {
              title: "JSX",
              description: "JSX syntax and usage",
              price: 10,
            },
            {
              title: "Props and State",
              description: "Passing data and managing state",
              price: 15,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      image: "https://placehold.co/100x100",
      students: 30,
      rating: 4.8,
      status: "Draft",
      active: false,
      sections: [
        {
          title: "Closures & Scope",
          lessons: [
            {
              title: "Closures",
              description: "Understanding JavaScript closures",
              price: 12,
            },
            {
              title: "Lexical Scope",
              description: "Scope chaining and how it works",
              price: 12,
            },
          ],
        },
        {
          title: "Async JS",
          lessons: [
            {
              title: "Promises",
              description: "Working with promises in JS",
              price: 15,
            },
            {
              title: "Async/Await",
              description: "Handling async code with async/await",
              price: 15,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      title: "Node.js Fundamentals",
      image: "https://placehold.co/100x100",
      students: 40,
      rating: 4.2,
      status: "Published",
      active: true,
      sections: [
        {
          title: "Intro to Node",
          lessons: [
            {
              title: "What is Node?",
              description: "A look into Node.js and its uses",
              price: 0,
            },
            {
              title: "Event Loop",
              description: "Understanding the event-driven architecture",
              price: 10,
            },
          ],
        },
        {
          title: "Modules",
          lessons: [
            {
              title: "CommonJS",
              description: "The module system used by Node.js",
              price: 8,
            },
            {
              title: "ES Modules",
              description: "Modern module syntax in JavaScript",
              price: 10,
            },
          ],
        },
      ],
    },
  ]);

  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);

  const handleEdit = (course) => {
    setEditingCourse({ ...course });
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

  const handleAddNew = () => {
    setEditingCourse({
      title: "",
      image: "https://placehold.co/100x100",
      students: "",
      rating: "",
      status: "Draft",
      active: false,
      sections: [],
    });
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
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Students
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Active
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {course.title}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {course.students}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {course.rating}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      course.status === "Published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
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
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={course.active}
                      onChange={() => handleToggleActive(course.id)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingCourse && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
              {editingCourse.id ? "Edit Course" : "Add New Course"}
            </h3>
            <input
              type="text"
              name="title"
              value={editingCourse.title}
              onChange={handleChange}
              placeholder="Course Title"
              className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <input
              type="text"
              name="image"
              value={editingCourse.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <input
              type="number"
              name="students"
              value={editingCourse.students}
              onChange={handleChange}
              placeholder="Number of Students"
              className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <input
              type="number"
              name="rating"
              value={editingCourse.rating}
              onChange={handleChange}
              placeholder="Rating"
              step="0.1"
              min="0"
              max="5"
              className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <select
              name="status"
              value={editingCourse.status}
              onChange={handleChange}
              className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
            <div className="mb-4 flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  checked={editingCourse.active}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "active",
                        value: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Active
                </span>
              </label>
            </div>
            <div className="flex justify-end">
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

      {/* View Modal */}
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
