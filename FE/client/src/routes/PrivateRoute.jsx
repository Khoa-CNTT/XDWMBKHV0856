import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingPage from "../components/common/LoadingPage";

const PrivateRoute = ({ children }) => {
  const { user, loadingUser } = useAuth();
  const location = useLocation();

  if (loadingUser) {
    return <LoadingPage />;
  }

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
