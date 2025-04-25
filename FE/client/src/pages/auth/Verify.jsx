import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa";
import { sendOtpToEmail } from "../../services/ProfileServices/OTPEmail.services";
import { register } from "../../services/auth.services";
import bcrypt from "bcryptjs";
import { useAuth } from "../../contexts/AuthContext";

const Verify = () => {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isResending, setIsResending] = useState(false);
  const email = location.state?.email;

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (location.state) {
      console.log("Form data received from Register:", location.state);
    } else {
      console.warn("No form data found in location.state");
    }
  }, [location]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 4) {
      const nextInput = document.querySelector(
        `input[name="code-${index + 1}"]`
      );
      if (nextInput) nextInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^\d]/g, "")
      .slice(0, 5);
    const newCode = [...verificationCode];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 5) newCode[i] = pastedData[i];
    }
    setVerificationCode(newCode);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name="code-${index - 1}"]`
      );
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = verificationCode.join("");

    if (code.length !== 5) {
      setError("Please enter the complete verification code");
      return;
    }

    setIsSubmitting(true);
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

      const isMatch = await bcrypt.compare(code, hashedOtp);

      if (isMatch) {
        const formData = location.state;

        // Đăng ký
        await register({
          ...formData,
          role: "STUDENT",
        });
        toast.success("Account created successfully!");
        // Đăng nhập
        await handleLogin(
          {
            loginName: formData.email,
            password: formData.password,
          },
          { silent: true } // không toast, không redirect
        );
        navigate("/survey/step1");
      } else {
        toast.error("Invalid OTP. Try again.");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      toast.error(err?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    try {
      await sendOtpToEmail(email);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-blue-600 text-black py-4 px-6 rounded-lg w-full text-lg transition shadow-md">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
            <FaEnvelope className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to
          </p>
          <p className="mt-1 text-lg font-medium text-primary">{email}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-center space-x-3">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  name={`code-${index}`}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-xl font-semibold border-2 rounded-lg 
                    focus:border-primary focus:outline-none transition-colors
                    hover:border-gray-400"
                  maxLength={1}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 px-4 py-2 rounded-full">
                {error}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent 
                rounded-lg text-white bg-primary hover:bg-primary/90 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                text-sm font-semibold"
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0 || isResending}
                  className={`font-medium ${countdown > 0 || isResending
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-primary hover:text-primary/90"
                    }`}
                >
                  {isResending ? "Sending..." : `Resend${countdown > 0 ? ` (${countdown}s)` : ""}`}
                </button>

              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify;
