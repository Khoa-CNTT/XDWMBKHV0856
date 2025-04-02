import { Route, Routes, useLocation } from "react-router-dom";
import HomeLayout from "../components/common/Layout/HomeLayout";
import HomePage from "../pages/guest/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import Register from "../pages/auth/Register";
import CourseDetailPage from "../pages/guest/CourseDetailPage";
import CourseListingPage from "../pages/guest/CourseListingPage";
import NotFoundPage from "../pages/NotFoundPage";
import AboutUsPage from "../pages/guest/AboutUsPage";
import ContactPage from "../pages/guest/ContactPage";

const PublicRoutes = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {isAuthRoute ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      ) : (
        <HomeLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/courses" element={<CourseListingPage />} />
            <Route path="/course/:id" element={<CourseDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </HomeLayout>
      )}
    </>
  );
};

export default PublicRoutes;
