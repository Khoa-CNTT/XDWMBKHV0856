import React, { useState } from "react";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";

const CourseContentAccordion = ({ sections = [] }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="mt-6 space-y-4">
      {sections.map((section, index) => (
        <div key={index} className="border rounded-2xl shadow-lg bg-white">
          <button
            onClick={() => toggleSection(index)}
            className="w-full flex justify-between items-center p-4 bg-gray-200 text-left rounded-t-2xl hover:bg-gray-300 transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {section.title}
            </h3>
            {openSection === index ? (
              <ChevronUp className="w-5 h-5 text-gray-700" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {openSection === index && (
            <div className="px-6 py-4 bg-white space-y-4 border-t">
              {section.lessons.map((lesson, i) => (
                <div key={i} className="border-b pb-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <strong className="text-gray-800">Title:</strong>
                    <p className="break-words flex-1 text-gray-700 p-2 bg-gray-100 rounded-lg">
                      {lesson.title}
                    </p>
                    <Edit className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3">
                    <strong className="text-gray-800">Description:</strong>
                    <p className="break-words flex-1 text-gray-700 p-2 bg-gray-100 rounded-lg">
                      {lesson.description}
                    </p>
                    <Edit className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700 flex-shrink-0" />
                  </div>
                  <p className="text-gray-800">
                    <strong>Price:</strong> ${lesson.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseContentAccordion;
