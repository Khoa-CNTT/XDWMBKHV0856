import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { checkEmailExist } from "../../services/user.services";
import { changePassword } from "../../services/ProfileServices/ChanePass.services";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { getCodeVerify } from "../../services/auth.services";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [isPasswordStep, setIsPasswordStep] = useState(false);

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleChange = (index, value) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  // Handle OTP submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError(""); // Reset lỗi trước khi xử lý
    const otpCode = otp.join("");
    // Lấy OTP đã mã hóa từ localStorage
    const hashedOtp = localStorage.getItem("code");

    // Nếu OTP không tồn tại hoặc đã hết hạn, hiển thị lỗi
    if (!hashedOtp) {
      setOtpError("OTP expired or not found. Please request again.");
      return;
    }

    // So sánh OTP người dùng nhập với OTP trong localStorage
    const isMatch = await bcrypt.compare(otpCode, hashedOtp);
    if (!isMatch) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }

    setIsPasswordStep(true); // Sau khi OTP hợp lệ, chuyển sang bước nhập mật khẩu mới
    toast.success("OTP verified successfully!"); // Thông báo thành công khi OTP hợp lệ
  };

  const handleResendCode = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    try {
      await getCodeVerify({ email });
      setCountdown(60);
      toast.success("OTP resent to your email.");
      setError("");
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend code. Please try again.");
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };
  // Theo thuứ tự form (Email -> OTP -> New Password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Kiểm tra nếu email chưa nhập
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Kiểm tra email hợp lệ
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const { userExists } = await checkEmailExist(email); // Gọi hàm kiểm tra email
      // console.log("Email:", email);  //kiểm tra
      if (!userExists) {
        setError(
          "This email is not registered. Please check your registered email."
        );
        return; // Dừng lại nếu email không tồn tại trong hệ thống
      }

      // Nếu email tồn tại, tiếp tục với bước gửi OTP
      if (!isOtpSent) {
        setIsLoading(true);
        try {
          // Gửi OTP qua email
          await getCodeVerify({ email });
          setIsOtpSent(true);
          setCountdown(60);
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } catch (err) {
          setError("Something went wrong. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    } catch (err) {
      setError("Error checking email. Please try again later.");
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Confirmation password does not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return;
    }

    try {
      const { userExists, userId } = await checkEmailExist(email);
      // const userId = user?.id;
      // if (!userId) {
      //     throw new Error("User ID is missing");
      // }
      await changePassword(userId, newPassword);
      toast.success("Password changed successfully!");
      setErrorMessage("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message);
      toast.error("Password change failed!");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-blue-600 text-black py-4 px-6 rounded-lg w-full text-lg transition shadow-md">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-card rounded-lg shadow-sm p-8 w-full relative z-10">
            <div className="mb-6">
              <button
                onClick={() => (window.location.href = "/login")}
                className="text-red-600 hover:text-red-400 transition-colors flex items-center gap-2"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>

            <h1 className="text-heading font-heading mb-2 text-foreground">
              Forgot Password?
            </h1>
            {isOtpSent && !isPasswordStep ? (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="otp"
                    className="mt-6 block text-sm font-medium text-red-600 mb-1"
                  >
                    Enter OTP
                  </label>
                  <p className="text-sm text-gray-500 mb-3 text-center">
                    If you don't see the code, please check your{" "}
                    <span className="font-semibold">Spam</span> folder.
                  </p>
                  <div className="mt-6 flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-14 text-center text-xl font-semibold border-2 rounded-lg 
                                                    focus:border-primary focus:outline-none transition-colors
                                                    hover:border-gray-400"
                        maxLength={1}
                      />
                    ))}
                  </div>
                  {otpError && <p className="text-red-600">{otpError}</p>}
                </div>

                <div className="flex justify-center items-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {isLoading ? (
                      <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mx-auto" />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={countdown > 0 || isResending}
                      className={`font-medium ${
                        countdown > 0 || isResending
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-primary hover:text-primary/90"
                      }`}
                    >
                      {isResending
                        ? "Sending..."
                        : `Resend${countdown > 0 ? ` (${countdown}s)` : ""}`}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        (window.location.href = "/forgot-password")
                      }
                      className="text-red-600 hover:text-red-400 transition-colors flex items-center gap-2"
                    >
                      Back to email
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              !isPasswordStep && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <p className="text-accent mb-6">
                      Enter your email address and we'll send you instructions
                      to reset your password.
                    </p>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-primary"
                    />
                    {error && (
                      <p className="text-red-600 mt-1 text-sm">{error}</p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isLoading || !email.trim()}
                      className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mx-auto" />
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </div>
                </form>
              )
            )}

            {isPasswordStep && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {errorMessage && (
                  <div className="text-destructive text-sm my-4">
                    {errorMessage}
                  </div>
                )}
                <div className="relative">
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-foreground"
                  >
                    New password
                  </label>
                  <input
                    type={showPassword.password ? "text" : "password"}
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background"
                    placeholder="Enter a new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 mt-5 right-3 flex items-center pr-2"
                    onClick={() => togglePasswordVisibility("password")}
                  >
                    {showPassword.password ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-foreground"
                  >
                    Confirm new password
                  </label>
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background"
                    placeholder="Re-enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 mt-5 right-3 flex items-center pr-2"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  >
                    {showPassword.confirmPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Change
                </button>
              </form>
            )}

            {success && (
              <p className="text-green-600 mt-2 text-center">
                Password reset successfully. Redirecting...
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
