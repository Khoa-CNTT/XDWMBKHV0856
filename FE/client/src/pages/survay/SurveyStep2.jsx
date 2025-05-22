import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getSkillsByFieldIds,
  postUserSkills,
  postUserFields,
} from "../../services/ModuleSkill.Sevices";
import { getCurrentUser } from "../../services/auth.services";

const SurveyStep2 = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [subjects, setSubjects] = useState(() => {
    return JSON.parse(localStorage.getItem("subjects")) || [];
  });
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.removeItem("subjects");
    setSubjects([]);
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      const storedIds = JSON.parse(localStorage.getItem("selectedFieldIds")) || [];
      if (storedIds.length > 0) {
        try {
          const fetchedSkills = await getSkillsByFieldIds(storedIds);
          setSkills(fetchedSkills);
        } catch (error) {
          console.error("Error fetching skills:", error);
        }
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user.id);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleNext = async () => {
    const selectedFieldIds = JSON.parse(localStorage.getItem("selectedFieldIds")) || [];

    if (!userId || selectedFieldIds.length === 0 || subjects.length === 0) return;

    const fieldPayload = {
      user: { id: userId },
      fields: selectedFieldIds.map((id) => ({ id })),
    };

    const skillPayload = {
      user: { id: userId },
      skills: skills
        .filter((s) => subjects.includes(s.id))
        .map((s) => ({ id: s.id })),
    };

    try {
      console.log("Sending user fields:", fieldPayload);
      await postUserFields(fieldPayload);

      console.log("Sending user skills:", skillPayload);
      await postUserSkills(skillPayload);

      navigate("/");
    } catch (error) {
      console.error("Failed to post user data", error);
    }
  };

  const handlePrevious = () => navigate("/survey/step1");

  // Lọc kỹ năng theo từ khóa tìm kiếm
  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const splitIndex = Math.ceil(filteredSkills.length / 2);
  const column1 = filteredSkills.slice(0, splitIndex);
  const column2 = filteredSkills.slice(splitIndex);

  return (
    <div className="flex flex-col min-h-screen p-12 items-center">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
        What Skill do you want to learn?
      </h2>

      <input
        type="text"
        placeholder="Search skills..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8 px-4 py-2 border border-gray-300 rounded-md w-full max-w-md text-gray-800"
      />

      <div className="flex flex-col sm:flex-row gap-10 w-full max-w-4xl justify-center ml-60">
        {[column1, column2].map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-3 w-full items-start">
            {column.map((skill) => (
              <label
                key={skill.id}
                className="flex items-center gap-3 cursor-pointer text-gray-700 text-base"
              >
                <input
                  type="checkbox"
                  className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:bg-blue-500 checked:border-blue-500 focus:outline-none"
                  checked={subjects.includes(skill.id)}
                  onChange={() => {
                    setSubjects((prev) => {
                      const updated = prev.includes(skill.id)
                        ? prev.filter((s) => s !== skill.id)
                        : [...prev, skill.id];
                      return updated;
                    });
                  }}
                />
                {skill.name}
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* Nút quay lại */}
      <div className="fixed bottom-6 left-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-500 text-white px-8 py-4 rounded-lg font-semibold shadow-md transition"
          onClick={handlePrevious}
        >
          Come back
        </motion.button>
      </div>

      {/* Nút tiếp tục */}
      <motion.button
        whileHover={{ scale: subjects.length > 0 ? 1.05 : 1 }}
        whileTap={{ scale: subjects.length > 0 ? 0.95 : 1 }}
        className={`fixed bottom-6 right-32 px-8 py-4 rounded-lg font-semibold shadow-md transition text-white ${subjects.length > 0
          ? "bg-green-500 hover:bg-green-600"
          : "bg-gray-400 opacity-50 cursor-not-allowed"
          }`}
        onClick={handleNext}
        disabled={subjects.length === 0}
      >
        Continue
      </motion.button>
    </div>
  );
};

export default SurveyStep2;
