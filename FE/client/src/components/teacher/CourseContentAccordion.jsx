import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const CourseContentAccordion = ({ sections = [] }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="mt-6 space-y-4">
      {sections.map((section, index) => (
        <div key={index} className="border rounded-2xl shadow">
          <button
            onClick={() => toggleSection(index)}
            className="w-full flex justify-between items-center p-4 bg-gray-100 text-left rounded-t-2xl"
          >
            <h3 className="text-lg font-semibold">{section.title}</h3>
            {openSection === index ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {openSection === index && (
            <div className="px-6 py-4 bg-white space-y-2">
              {section.lessons.map((lesson, i) => (
                <div key={i} className="border-b pb-2">
                  <p>
                    <strong>Title:</strong> {lesson.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {lesson.description}
                  </p>
                  <p>
                    <strong>Price:</strong> ${lesson.price}
                  </p>
                  {/* Add more fields if needed */}
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
