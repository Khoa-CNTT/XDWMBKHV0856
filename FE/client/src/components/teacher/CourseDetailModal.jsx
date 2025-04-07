import React, { useState } from "react";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";
import CourseContentAccordion from "./CourseContentAccordion"; // ✅ Thêm dòng này

const CourseDetailModal = ({ course, onClose }) => {
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[90vw] h-[90vh] rounded-2xl shadow-xl p-8 relative overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Course Details
        </h2>

        <div className="mb-6 space-y-4 text-lg text-gray-700">
          <div className="flex flex-col">
            <strong>Title:</strong>
            <div className="flex justify-between items-start gap-2 w-full">
              <p className="break-words whitespace-pre-line w-full">
                {course.title}
              </p>
              <Edit className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700 flex-shrink-0" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <strong>Price:</strong>
            <p className="flex-1">${course.price}</p>
            <Edit className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700" />
          </div>
          <div>
            <strong>Students:</strong> {course.students}
          </div>
          <div>
            <strong>Rating:</strong> {course.rating}
          </div>
          <div className="flex flex-col">
            <strong>Description:</strong>
            <div className="flex justify-between items-start gap-2 w-full">
              <p className="break-words whitespace-pre-line w-full">
                {course.description}
              </p>
              <Edit className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* ✅ Accordion Sections được thay bằng component tách riêng */}
        <CourseContentAccordion sections={course.sections || []} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>

        {/* Nút close ở cuối trang */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;
