import { useEffect } from "react";
import { Route, Router, Routes } from "react-router-dom";
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
import { useAuthStore } from "./store/useAuthStore";
import { useCourseStore } from "./store/useCourseStore";
import { useOrderStore } from "./store/useOrderStore";

const App = () => {
  const { user, fetchCurrentUser, isLoadingCurrentUser } = useAuthStore();
  const { fetchCourses, isLoadingCourses } = useCourseStore();
  const { fetchOrders, isLoadingOrders } = useOrderStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchOrders({
      filter: `buyer.id~'${user?.id}'`,
    });
  }, []);

  if (isLoadingCurrentUser || isLoadingCourses || isLoadingOrders) {
    return <LoadingPage />;
  }

  return (
    <Router>
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
    </Router>
     


  );
};

export default App;
