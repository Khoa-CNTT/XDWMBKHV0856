import { Route, Routes } from "react-router-dom";
import HomeLayout from "../components/common/Layout/HomeLayout";
import HomePage from "../pages/guest/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import CourseDetailPage from "../pages/guest/CourseDetailPage";
import CourseListingPage from "../pages/guest/CourseListingPage";
import NotFoundPage from "../pages/NotFoundPage";
import AboutUsPage from "../pages/guest/AboutUsPage";
import ContactPage from "../pages/guest/ContactPage";
import BreadcrumbLayout from "../components/common/Layout/BreadcrumbLayout";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/courses"
          element={
            <BreadcrumbLayout>
              <CourseListingPage />
            </BreadcrumbLayout>
          }
        />
        <Route
          path="/courses/:category/:courseId"
          element={
            <BreadcrumbLayout>
              <CourseDetailPage />
            </BreadcrumbLayout>
          }
        />
        <Route
          path="/courses/:category"
          element={
            <BreadcrumbLayout>
              <CourseListingPage />
            </BreadcrumbLayout>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export default PublicRoutes;
