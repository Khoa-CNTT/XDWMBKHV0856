import { Route, Routes } from "react-router-dom";
import TeacherLayout from "../components/common/Layout/TeacherLayout";
import DashboardTeacher from "../pages/teacher/DashboardTeacher";
import CourseManagement from "../pages/teacher/CourseManagement";
import Statistics from "../pages/teacher/Statistics";
import Profile from "../pages/teacher/Profile";
import WalletLayout from "../components/common/Layout/WalletLayout";
import ProfileAndWallet from "../pages/teacher/wallet/ProfileAndWallet";
import History from "../pages/teacher/wallet/History";

const TeacherRoutes = () => {
  return (
    <TeacherLayout>
      <Routes>
        {/* Dashboard chính */}
        <Route path="dashboard" element={<DashboardTeacher />} />

        {/* Quản lý khóa học */}
        <Route path="courses" element={<CourseManagement />} />

        {/* Thống kê */}
        <Route path="statistics" element={<Statistics />} />

        {/* Thông tin cá nhân */}
        <Route path="profile" element={<Profile />} />

        {/* Routes ví điện tử */}
        <Route path="wallet" element={<WalletLayout />}>
          {/* Thông tin ví */}
          <Route path="information" element={<ProfileAndWallet />} />
          {/* Lịch sử giao dịch */}
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </TeacherLayout>
  );
};

export default TeacherRoutes;
