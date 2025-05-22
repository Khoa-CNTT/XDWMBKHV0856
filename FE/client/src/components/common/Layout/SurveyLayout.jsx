import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const steps = [
  { id: 1, path: "/survey/step1" },
  { id: 2, path: "/survey/step2" },
  // { id: 3, path: "/survey/step3" },
];

const DashboardLayout = ({ children }) => {
  const location = useLocation(); // Lấy URL hiện tại

  // Xác định bước hiện tại dựa trên pathname
  const currentStepIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100; // Tính phần trăm hoàn thành

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Thanh điều hướng ngang */}
      <nav className="w-full bg-white shadow-md flex flex-col items-center py-4">
        {/* Hiển thị tiến trình */}
        <div className="w-2/3 bg-gray-300 h-2 rounded-full mb-3 relative">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Các bước khảo sát */}
        <div className="flex">
          {steps.map((step, index) => (
            <Link key={step.id} to={step.path} className="relative mx-4">
              <motion.div
                className={`w-4 h-4 rounded-full ${location.pathname === step.path
                    ? "bg-primary"
                    : "bg-gray-300 hover:bg-blue-400"
                  }`}
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </div>
      </nav>

      {/* Nội dung chính */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-8 overflow-auto"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
