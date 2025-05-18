import { Route, Routes } from "react-router-dom";
import HomeLayout from "../components/common/Layout/HomeLayout";
import CheckoutPage from "../pages/student/CheckoutPage";
import UserProfilePage from "../pages/student/AccountSeting.jsx/UserProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import QuickCheckoutPage from "../pages/student/QuickCheckoutPage";
import LearningDashboardPage from "../pages/student/LearningDashboardPage";
import LearningPage from "../pages/student/LearningPage";

const StudentRoutes = () => {
  return (
    <Routes>
      {/* Routes với HomeLayout */}
      <Route element={<HomeLayout />}>
        {/* Trang cài đặt tài khoản */}
        <Route path="account" element={<UserProfilePage />} />

        {/* Routes thanh toán */}
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/:courseId" element={<QuickCheckoutPage />} />

        {/* Trang dashboard học tập */}
        <Route path="learning-dashboard" element={<LearningDashboardPage />} />

        {/* Route 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Route học bài - không có layout chung */}
      <Route path="learning/:courseId/:lectureId" element={<LearningPage />} />
    </Routes>
  );
};

export default StudentRoutes;
