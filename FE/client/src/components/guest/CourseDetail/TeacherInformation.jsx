import { FaStar, FaUsers } from "react-icons/fa";

const TeacherInformation = (courseDetails) => {
  return (
    <>
      <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-start space-x-6">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            alt={courseDetails.instructor}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2 dark:text-white">
              {courseDetails.instructor}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Senior Web Developer with 10+ years of experience
            </p>
            <div className="flex space-x-4">
              <span className="flex items-center">
                <FaUsers className="mr-2" /> 50K+ students
              </span>
              <span className="flex items-center">
                <FaStar className="mr-2" /> 4.8 Instructor rating
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherInformation;
