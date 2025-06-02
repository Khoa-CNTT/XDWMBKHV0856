import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.authReducer) || {};
  console.log("userInfo", userInfo);

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không phải ADMIN hoặc ROOT, chuyển hướng về trang login
  if (userInfo.role !== "ADMIN" && userInfo.role !== "ROOT") {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập và có quyền ADMIN, cho phép truy cập
  return <Outlet />;
};

export default PrivateRoute;
