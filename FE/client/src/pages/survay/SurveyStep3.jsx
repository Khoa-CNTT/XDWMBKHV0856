// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// const SurveyStep3 = () => {
//   const navigate = useNavigate();

//   // Lấy dữ liệu từ localStorage (nếu có)
//   const [goal, setGoal] = useState(() => {
//     return localStorage.getItem("goal") || "";
//   });
// //
//   useEffect(() => {
//     localStorage.setItem("goal", goal);
//   }, [goal]);

//   const handlePrevious = () => navigate("/survey/step2");

//   const handleSubmit = () => {
//     alert("🎉 Cảm ơn bạn đã hoàn thành khảo sát!");
//     navigate("/");
//   };

//   return (
//     <div className="flex flex-col min-h-screen p-12">
//       {/* Tiêu đề */}
//       <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
//         Mục tiêu học tập của bạn là gì?
//       </h2>

//       {/* Ô nhập mục tiêu */}
//       <motion.textarea
//         className="w-full max-w-4xl mx-auto p-4 border rounded-lg text-lg focus:ring focus:ring-primary"
//         placeholder="Hãy chia sẻ mục tiêu học tập của bạn..."
//         value={goal}
//         onChange={(e) => setGoal(e.target.value)}
//         rows={5}
//         whileFocus={{ scale: 1.02 }}
//       />

//       {/* Nút điều hướng */}
//       <div className="fixed bottom-6 left-6 flex gap-4">
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           className="bg-gray-500 text-white px-8 py-4 rounded-lg font-semibold shadow-md transition"
//           onClick={handlePrevious}
//         >
//           Quay lại
//         </motion.button>
//       </div>

//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         className="fixed bottom-6 right-6 bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold shadow-md transition"
//         onClick={handleSubmit}
//       >
//         Hoàn tất
//       </motion.button>
//     </div>
//   );
// };

// export default SurveyStep3;
