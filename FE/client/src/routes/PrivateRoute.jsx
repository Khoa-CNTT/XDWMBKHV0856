import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Chuyển hướng họ đến trang /login, nhưng lưu lại vị trí hiện tại mà họ
    // đang cố gắng truy cập khi bị chuyển hướng. Điều này cho phép chúng ta
    // gửi họ đến trang đó sau khi họ đăng nhập, điều này mang lại trải nghiệm người dùng
    // tốt hơn so với việc để họ ở trang chính.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
