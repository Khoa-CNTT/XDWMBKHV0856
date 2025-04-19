import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiMail } from "react-icons/fi";
import bcrypt from "bcryptjs";
import { sendOtpToEmail } from "../../../services/ProfileServices/OTPEmail.services";
import { changePassword } from "../../../services/ProfileServices/ChanePass.services";
import { useAuth } from "../../../contexts/AuthContext";

export default function ChangePassword() {
  const { user } = useAuth();
  const email = user?.email;  // Access email from user context
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (email) {
      setMaskedEmail(maskEmail(email));  // Set the masked email when email is available
    }
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setOtpSent(false);
    }
    return () => clearInterval(timer);
  }, [countdown, email]);

  const userId = user?.id;
  if (!userId) {
    throw new Error("User ID is missing");
  }

  const maskEmail = (email) => {
    if (!email || !email.includes('@')) {
      return "Invalid email"; // Hoặc giá trị mặc định nếu không có email hợp lệ
    }
    const [name, domain] = email.split("@");
    return `${name[0]}****@${domain}`;
  };

  // Gửi OTP qua email
  const handleGetOtp = async () => {
    setLoading(true);
    try {
      await sendOtpToEmail(email);
      toast.success("OTP sent to your email!");
      setOtpSent(true);
      setCountdown(60);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Xác minh OTP bằng cookie và bcrypt
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const cookies = document.cookie
        .split("; ")
        .find((row) => row.startsWith("code="));
      const hashedOtp = cookies
        ? decodeURIComponent(cookies.split("=")[1])
        : null;

      if (!hashedOtp) {
        toast.error("OTP expired or not found. Please request again.");
        return;
      }

      const isMatch = await bcrypt.compare(otp, hashedOtp);
      if (isMatch) {
        toast.success("OTP verified!");
        setShowPasswordForm(true);
      } else {
        toast.error("Invalid OTP. Try again.");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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
      await changePassword(userId, newPassword);
      toast.success("Password changed successfully!");
      setErrorMessage("");
      setNewPassword("");
      setConfirmPassword("");
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
    <div className="mt-20 justify-center bg-background flex items-center p-4">
      <div className="w-full max-w-max bg-card rounded-lg shadow-sm p-8">
        <h1 className="text-heading font-heading text-center mb-8 text-foreground">
          Change Password
        </h1>

        {!showPasswordForm ? (
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
              <FiMail className="text-accent text-xl" />
              <div>
                <p className="text-sm text-accent-foreground">Email Address</p>
                <p className="text-foreground font-medium">{maskedEmail}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-foreground"
              >
                Enter OTP
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 5-digit OTP"
                  className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-background"
                  maxLength={5}
                />
                <button
                  onClick={handleGetOtp}
                  disabled={otpSent || loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${otpSent
                    ? "bg-muted text-accent-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                >
                  {loading
                    ? "Sending..."
                    : countdown > 0
                      ? `${countdown}s`
                      : "Get OTP"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 5 || loading}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${otp.length !== 5
                  ? "bg-muted text-accent-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {errorMessage && (
              <div className="text-destructive text-sm">{errorMessage}</div>
            )}
            <div className="w-96">
              <form onSubmit={handlePasswordChange} className="space-y-4">
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
              <div className="mt-10  bg-slate-100 rounded-lg p-4">
                <span className="text-gray-400">
                  <div className="text-red-500">Hint:</div> Use at least 8
                  characters.
                  <br />
                  Combines the letters a-z, numbers 0-9 and some special
                  characters.
                  <br />
                  Avoid using easily guessable strings like your date of birth
                  in your password.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}
