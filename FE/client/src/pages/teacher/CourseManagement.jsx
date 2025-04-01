import React, { useState } from "react";
import CourseDetailModal from "../../components/teacher/CourseDetailModal"; // chỉnh lại path nếu khác

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React Basics",
      students: 50,
      rating: 4.5,
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
      students: 30,
      rating: 4.8,
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
      students: 40,
      rating: 4.2,
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
    setEditingCourse({ title: "", students: 0, rating: 0 });
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
                Students
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                View
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
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-primary hover:text-primary-dark mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    onClick={() => setViewingCourse(course)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View
                  </button>
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
              className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
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
