import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const interestsList = [
  "Công nghệ",
  "Kinh tế",
  "Y học",
  "Khoa học",
  "Nghệ thuật",
  "Thể thao",
  "Giáo dục",
  "Du lịch",
  "Tâm lý học",
  "Kỹ thuật",
  "Lập trình",
  "Marketing",
  "Âm nhạc",
  "Nhiếp ảnh",
  "Thiết kế",
  "Ngôn ngữ",
  "Lịch sử",
  "Triết học",
  "Môi trường",
  "Quản trị kinh doanh",
];

const SurveyStep1 = () => {
  const navigate = useNavigate();

  const [interests, setInterests] = useState(() => {
    return JSON.parse(localStorage.getItem("interests")) || [];
  });

  useEffect(() => {
    localStorage.setItem("interests", JSON.stringify(interests));
  }, [interests]);

  const handleNext = () => navigate("/survey/step2");
  const handlePrevious = () => navigate("/verify");

  const splitIndex = Math.ceil(interestsList.length / 2);
  const column1 = interestsList.slice(0, splitIndex);
  const column2 = interestsList.slice(splitIndex);

  return (
    <div className="flex flex-col min-h-screen p-12 items-center ml-10">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
        Bạn quan tâm đến lĩnh vực nào?
      </h2>

      {/* Hiển thị 2 cột dọc */}
      <div className="flex flex-col sm:flex-row gap-10 w-full max-w-4xl justify-center ml-60">
        {[column1, column2].map((column, colIndex) => (
          <div
            key={colIndex}
            className="flex flex-col gap-3 w-full items-start"
          >
            {column.map((item) => (
              <label
                key={item}
                className="flex items-center gap-3 cursor-pointer text-gray-700 text-base"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 border-2 border-gray-400 rounded-full appearance-none checked:bg-primary checked:border-primary focus:outline-none transition"
                  checked={interests.includes(item)}
                  onChange={() =>
                    setInterests((prev) =>
                      prev.includes(item)
                        ? prev.filter((i) => i !== item)
                        : [...prev, item]
                    )
                  }
                />
                {item}
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* Nút điều hướng */}
      <div className="fixed bottom-6 left-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-500 text-white px-8 py-4 rounded-lg font-semibold shadow-md transition"
          onClick={handlePrevious}
        >
          Quay lại
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-green-500 text-white px-8 py-4 rounded-lg font-semibold shadow-md transition"
        onClick={handleNext}
      >
        Tiếp tục
      </motion.button>
    </div>
  );
};

export default SurveyStep1;
