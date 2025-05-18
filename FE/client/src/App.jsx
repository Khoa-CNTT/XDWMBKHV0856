import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/common/Layout/ScrollToTop";
import Verify from "./pages/auth/Verify";
import PaymentRoutes from "./routes/PaymentRoutes";
import {
  PrivateRoute,
  StudentRoute,
  InstructorRoute,
} from "./routes/PrivateRoute";
import PublicRoutes from "./routes/PublicRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import SurveyRoutes from "./routes/SurveyRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import TeacherRegister from "./pages/auth/teacherregister/TeacherRegister";
import AiChat from "./components/AiChat"; // Import our new AiChat componen

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Route public */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Route dashboard student - chỉ cho STUDENT */}
        <Route
          path="/student/*"
          element={
            <StudentRoute>
              <StudentRoutes />
            </StudentRoute>
          }
        />

        {/* Route payment - cho cả STUDENT và INSTRUCTOR */}
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

        {/* Route instructor - chỉ cho INSTRUCTOR */}
        <Route
          path="/instructor/*"
          element={
            <InstructorRoute>
              <TeacherRoutes />
            </InstructorRoute>
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
