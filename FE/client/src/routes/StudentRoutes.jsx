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
      <Route element={<HomeLayout />}>
        <Route path="account" element={<UserProfilePage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/:courseId" element={<QuickCheckoutPage />} />
        <Route path="learning-dashboard" element={<LearningDashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="learning/:courseId/:lectureId" element={<LearningPage />} />
    </Routes>
  );
};

export default StudentRoutes;
