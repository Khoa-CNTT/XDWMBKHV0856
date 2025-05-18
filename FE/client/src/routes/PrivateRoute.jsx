import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingPage from "../components/common/LoadingPage";

// Component cho route yêu cầu đăng nhập
const PrivateRoute = ({ children }) => {
  const { user, loadingUser } = useAuth();
  const location = useLocation();

  if (loadingUser) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Component cho route chỉ dành cho STUDENT
const StudentRoute = ({ children }) => {
  const { user, loadingUser } = useAuth();
  const location = useLocation();

  if (loadingUser) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    user.role !== "STUDENT" ||
    user.role !== "INSTRUCTOR" ||
    user.role !== "ADMIN" ||
    user.role !== "ROOT"
  ) {
    return children;
  }

  return <Navigate to="/" replace />;
};

// Component cho route chỉ dành cho INSTRUCTOR
const InstructorRoute = ({ children }) => {
  const { user, loadingUser } = useAuth();
  const location = useLocation();

  if (loadingUser) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    user.role == "INSTRUCTOR" ||
    user.role == "ADMIN" ||
    user.role == "ROOT"
  ) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export { PrivateRoute, StudentRoute, InstructorRoute };
