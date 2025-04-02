import {
  FaBook,
  FaCertificate,
  FaClock,
  FaPlay,
  FaStar,
  FaUsers,
} from "react-icons/fa";

const CourseSummary = (courseDetails) => {
  return (
    <>
      {/* Phần đầu trang với thông tin tóm tắt về khóa học */}
      <div className="bg-gradient-to-r from-primary to-chart-3 dark:from-gray-800 dark:to-gray-700">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Cột bên trái: Tiêu đề, mô tả, rating, số học viên, thông tin giảng viên */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {courseDetails.title}
              </h1>
              <p className="text-gray-100 mb-6">{courseDetails.description}</p>
              <div className="flex items-center space-x-4 mb-6">
                {/* Hiển thị rating (sao) */}
                <div className="flex items-center">
                  <FaStar className="text-chart-4 mr-1" />
                  <span className="text-white">
                    {courseDetails.rating} (4,500 reviews)
                  </span>
                </div>
                {/* Hiển thị số lượng học viên */}
                <div className="flex items-center">
                  <FaUsers className="text-white mr-1" />
                  <span className="text-white">
                    {courseDetails.students.toLocaleString()} students
                  </span>
                </div>
              </div>
              {/* Thông tin giảng viên */}
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt={courseDetails.instructor}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-medium">Created by</p>
                  <p className="text-white">{courseDetails.instructor}</p>
                </div>
              </div>
            </div>

            {/* Cột bên phải: Ảnh, giá khóa học, nút đăng ký, thông tin thời lượng */}
            <div className="bg-card dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <img
                src={courseDetails.image}
                alt={courseDetails.title}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />
              <div className="text-3xl font-bold text-primary dark:text-primary-foreground mb-6">
                ${courseDetails.price}
              </div>
              <button className="w-full bg-primary text-white py-3 rounded-lg mb-4 hover:bg-opacity-90 transition-colors">
                Enroll Now
              </button>
              <div className="space-y-4">
                {/* Thời lượng khóa học */}
                <div className="flex items-center">
                  <FaClock className="text-accent mr-2" />
                  <span className="dark:text-gray-200">
                    {courseDetails.hours} hours of content
                  </span>
                </div>
                {/* Số bài học */}
                <div className="flex items-center">
                  <FaPlay className="text-accent mr-2" />
                  <span className="dark:text-gray-200">
                    {courseDetails.lessons} lessons
                  </span>
                </div>
                {/* Trình độ */}
                <div className="flex items-center">
                  <FaBook className="text-accent mr-2" />
                  <span className="dark:text-gray-200">
                    {courseDetails.level}
                  </span>
                </div>
                {/* Chứng chỉ */}
                <div className="flex items-center">
                  <FaCertificate className="text-accent mr-2" />
                  <span className="dark:text-gray-200">
                    Certificate of completion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseSummary;
