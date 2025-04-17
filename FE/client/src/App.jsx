import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/common/Layout/ScrollToTop";
import LoadingPage from "./components/common/LoadingPage";
import Verify from "./pages/auth/Verify";
import PaymentRoutes from "./routes/PaymentRoutes";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoutes from "./routes/PublicRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import SurveyRoutes from "./routes/SurveyRoutes";
import TeacherRoutes from "./routes/TeacherRoutes";
import { useCourseStore } from "./store/useCourseStore";
import { useOrderStore } from "./store/useOrderStore";
import { useAuth } from "./contexts/AuthContext";
import TeacherRegister from "./pages/auth/teacherregister/TeacherRegister";

const App = () => {
  const { user, loadingUser } = useAuth();
  const { fetchCourses, isLoadingCourses } = useCourseStore();
  const { fetchOrders, isLoadingOrders } = useOrderStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchOrders({
      filter: `buyer.id~'${user?.id}'`,
    });
  }, [fetchOrders, user?.id]);

  if (loadingUser || isLoadingCourses || isLoadingOrders) {
    return <LoadingPage />;
  }

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
        <Route path="dkinstructor" element={<TeacherRegister />} />
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
    </>
  );
};

export default App;
