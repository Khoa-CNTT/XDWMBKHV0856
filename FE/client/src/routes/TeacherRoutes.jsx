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
        <Route path="dashboard" element={<DashboardTeacher />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="profile" element={<Profile />} />
        <Route path="wallet" element={<WalletLayout />}>
          <Route path="information" element={<ProfileAndWallet />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </TeacherLayout>
  );
};

export default TeacherRoutes;
