import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin/layout/AdminLayout";
import CouponManagement from "./pages/admin/coupon/CouponManagement";
import CourseManagement from "./pages/admin/course/CourseManagement";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import StudyManagement from "./pages/admin/study/StudyManagement";
import UserManagement from "./pages/admin/user/UserManagement";
import WithdrawRequestAdmin from "./pages/admin/withdraw/WithdrawManagement";
import LoginAdmin from "./pages/login/LoginAdmin";
import NotFoundPage from "./pages/NotFoundPage";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginAdmin/>}/>
        {/* Route dành cho admin  */}
        <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/courses" element={<CourseManagement />} />
        <Route path="/withdraws" element={<WithdrawRequestAdmin />} />
        <Route path="/studies" element={<StudyManagement />} />
        <Route path="/coupons" element={<CouponManagement />} />
        <Route path="/profile" element= {<Profile/>} />
      </Route>
        {/* Page 404  */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
