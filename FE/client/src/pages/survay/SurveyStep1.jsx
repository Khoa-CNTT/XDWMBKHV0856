import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getFields } from "../../services/field.services";

const SurveyStep1 = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState(() => {
    return JSON.parse(localStorage.getItem("interests")) || [];
  });
  const [fields, setFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.removeItem("interests");
    setInterests([]);

    const fetchFields = async () => {
      try {
        const data = await getFields();
        setFields(data.result);
      } catch (error) {
        console.error("Failed to fetch fields", error);
      }
    };
    fetchFields();
  }, []);

  const handleNext = () => {
    if (interests.length === 0) {
      alert("Please select at least one interest before continuing.");
      return;
    }

    const selectedFieldIds = fields
      .filter((f) => interests.includes(f.name))
      .map((f) => f.id);

    localStorage.setItem("selectedFieldIds", JSON.stringify(selectedFieldIds));
    navigate("/survey/step2");
  };

  // 🔍 Lọc danh sách theo từ khóa tìm kiếm
  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const splitIndex = Math.ceil(filteredFields.length / 2);
  const column1 = filteredFields.slice(0, splitIndex);
  const column2 = filteredFields.slice(splitIndex);

  return (
    <div className="flex flex-col min-h-screen p-12 items-center ml-10">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
        What are you interested in?
      </h2>

      {/* 🔍 Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Search interests..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8 px-4 py-2 border border-gray-300 rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex flex-col sm:flex-row gap-10 w-full max-w-4xl justify-center ml-60">
        {[column1, column2].map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-3 w-full items-start">
            {column.map((field) => (
              <label
                key={field.id}
                className="flex items-center gap-3 cursor-pointer text-gray-700 text-base"
              >
                <input
                  type="checkbox"
                  className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:bg-blue-500 checked:border-blue-500 focus:outline-none"
                  checked={interests.includes(field.name)}
                  onChange={() => {
                    setInterests((prev) => {
                      const updated = prev.includes(field.name)
                        ? prev.filter((i) => i !== field.name)
                        : [...prev, field.name];
                      return updated;
                    });
                  }}
                />
                {field.name}
              </label>
            ))}
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: interests.length > 0 ? 1.05 : 1 }}
        whileTap={{ scale: interests.length > 0 ? 0.95 : 1 }}
        className={`fixed bottom-6 right-32 px-8 py-4 rounded-lg font-semibold shadow-md transition text-white ${interests.length > 0
          ? "bg-green-500 hover:bg-green-600"
          : "bg-gray-400 opacity-50 cursor-not-allowed"
          }`}
        onClick={handleNext}
        disabled={interests.length === 0}
      >
        Continue
      </motion.button>
    </div>
  );
};

export default SurveyStep1;
