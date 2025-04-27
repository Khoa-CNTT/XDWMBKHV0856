import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/common/Layout/ScrollToTop";
import Verify from "./pages/auth/Verify";
import PaymentRoutes from "./routes/PaymentRoutes";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoutes from "./routes/PublicRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import SurveyRoutes from "./routes/SurveyRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import TeacherRegister from "./pages/auth/teacherregister/TeacherRegister";
import AiChat from "./components/AiChat"; // Import our new AiChat component

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Route public */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Route dashboard student */}
        <Route
          path="/student/*"
          element={
            <PrivateRoute>
              <StudentRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="/payment/*"
          element={
            <PrivateRoute>
              <PaymentRoutes />
            </PrivateRoute>
          }
        />
        <Route path="instructor-register" element={<TeacherRegister />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/survey/*" element={<SurveyRoutes />} />
        {/* Thêm route cho giảng viên với PrivateRoute */}
        <Route
          path="/instructor/*"
          element={
            // <PrivateRoute> dòng này để bảo vệ dashboard teacer phải đăng nhập thì mới vào được( giờ tạm tắt để css )
            <TeacherRoutes />
            // </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer />

      {/* Add AI Chatbox that will be available on all pages */}
      <AiChat />
    </>
  );
};

export default App;
