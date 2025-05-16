import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../services/auth.services";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function GoogleLoginSuccess() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        const response = await googleLogin();
        console.log(response);
        if (response.success) {
          toast.success("Đăng nhập Google thành công!");
          navigate("/");
        } else {
          throw new Error(response.message || "Login failed");
        }
      } catch (err) {
        setError(err.message || "Failed to login with Google");
        toast.error(err.message || "Failed to login with Google");
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };
    handleGoogleLogin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-lg">Đang xử lý đăng nhập Google...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-lg">
            <p>Error: {error}</p>
            <p className="text-sm mt-2">Đang chuyển về trang đăng nhập...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
