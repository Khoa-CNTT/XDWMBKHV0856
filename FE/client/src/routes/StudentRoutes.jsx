import { Route, Routes } from "react-router-dom";
import HomeLayout from "../components/common/Layout/HomeLayout";
import CheckoutPage from "../pages/student/CheckoutPage";
import UserProfilePage from "../pages/student/AccountSeting.jsx/UserProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import QuickCheckoutPage from "../pages/student/QuickCheckoutPage";

const StudentRoutes = () => {
  return (
    <HomeLayout>
      <Routes>
        <Route path="account" element={<UserProfilePage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/:courseId" element={<QuickCheckoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HomeLayout>
  );
};

export default StudentRoutes;
