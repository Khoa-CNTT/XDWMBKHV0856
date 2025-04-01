import { FaCheckCircle } from "react-icons/fa";

const WhatYouWillLearn = (courseDetails) => {
  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              What you will learn
            </h2>
            {/* Danh sách các chủ đề (topics) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {courseDetails.topics.map((topic, index) => (
                <div key={index} className="flex items-start">
                  <FaCheckCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                  <span className="dark:text-gray-200">{topic}</span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Requirements
            </h2>
            {/* Danh sách yêu cầu (requirements) */}
            <ul className="list-disc pl-6 space-y-2 mb-12">
              {courseDetails.requirements.map((req, index) => (
                <li key={index} className="dark:text-gray-200">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatYouWillLearn;
