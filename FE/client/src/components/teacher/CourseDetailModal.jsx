import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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

        <div className="mb-6 space-y-2 text-lg text-gray-700">
          <div>
            <strong>Title:</strong> {course.title}
          </div>
          <div>
            <strong>Students:</strong> {course.students}
          </div>
          <div>
            <strong>Rating:</strong> {course.rating}
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
      </div>
    </div>
  );
};

export default CourseDetailModal;
