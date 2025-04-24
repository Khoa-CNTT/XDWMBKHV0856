import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLayout from '../components/admin/layout/AdminLayout'
import CouponManagement from '../pages/admin/coupon/CouponManagement'
import CourseManagement from '../pages/admin/course/CourseManagement'
import Dashboard from '../pages/admin/dashboard/Dashboard'
import StudyManagement from '../pages/admin/study/StudyManagement'
import UserManagement from '../pages/admin/user/UserManagement'
import WithdrawRequestAdmin from '../pages/admin/withdraw/WithdrawManagement'
const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="withdraws" element={<WithdrawRequestAdmin />} />
        <Route path="studies" element={<StudyManagement />} />
        <Route path="coupons" element={<CouponManagement />} />
        
      </Route>
    </Routes>
  )
}

export default AdminRoutes