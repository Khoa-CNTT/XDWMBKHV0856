import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const subjectsList = [
  "Quản trị kinh doanh",
  "Tài chính",
  "Kế toán",
  "Marketing",
  "Thiết kế đồ họa",
  "Âm nhạc",
  "Thời trang",
  "Trí tuệ nhân tạo (AI)",
  "Khoa học máy tính",
  "Vật lý",
  "Toán ứng dụng",
  "Y khoa",
  "Dược học",
  "Thể thao & Sức khỏe",
  "Luật",
  "Khoa học chính trị",
  "Xã hội học",
  "Triết học",
  "Ngôn ngữ học",
  "Kỹ thuật cơ khí",
  "Kỹ thuật điện",
  "Xây dựng",
  "Kiến trúc",
];

const SurveyStep2 = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState(() => {
    return JSON.parse(localStorage.getItem("subjects")) || [];
  });

  const [customSubject, setCustomSubject] = useState("");

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  const handleNext = () => navigate("/survey/step3");
  const handlePrevious = () => navigate("/survey/step1");

  const splitIndex = Math.ceil(subjectsList.length / 2);
  const column1 = subjectsList.slice(0, splitIndex);
  const column2 = subjectsList.slice(splitIndex);

  return (
    <div className="flex flex-col min-h-screen p-12 items-center ">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
        Bạn muốn học Skill nào?
      </h2>

      {/* Hiển thị 2 cột dọc giống trang 1 */}
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
                  type="radio"
                  className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:bg-blue-500 checked:border-blue-500 focus:outline-none"
                  checked={subjects.includes(item)}
                  onChange={() =>
                    setSubjects((prev) =>
                      prev.includes(item)
                        ? prev.filter((s) => s !== item)
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

      {/* Nhập môn học khác */}
      {/* <div className="flex items-center justify-center mt-8 space-x-4">
        <input
          type="text"
          placeholder="Nhập môn khác..."
          value={customSubject}
          onChange={(e) => setCustomSubject(e.target.value)}
          className="p-3 border rounded-lg w-72 focus:ring focus:ring-primary"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
          onClick={() => {
            if (customSubject.trim() && !subjects.includes(customSubject)) {
              setSubjects([...subjects, customSubject.trim()]);
              setCustomSubject("");
            }
          }}
        >
          Thêm
        </motion.button>
      </div> */}

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

export default SurveyStep2;
