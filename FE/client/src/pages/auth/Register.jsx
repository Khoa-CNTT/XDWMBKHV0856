import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import registerImage from "../../assets/images/register1.png";
// import registerImage1 from "../../assets/images/register2.png";
import registerImage2 from "../../assets/images/register3.png";
import registerImage4 from "../../assets/images/register4.png";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { sendOtpToEmail } from "../../services/ProfileServices/OTPEmail.services";
import { checkEmailExist } from "../../services/user.services";

// Thêm styles cho animation
const slideInStyles = `
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.5s ease-out;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.5s ease-out;
  }
`;

const slides = [
  {
    image: registerImage,
  },
  {
    image: registerImage4,
  },
  {
    image: registerImage2,
  },
];

const Register = () => {
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Reset error messages

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Kiểm tra email có tồn tại trong hệ thống không
        const { userExists, userId } = await checkEmailExist(formData.email);

        if (userExists) {
          // Nếu email đã tồn tại, hiển thị thông báo lỗi
          setError("This email is already registered. Please check your email.");
          return;  // Dừng lại nếu email đã có trong hệ thống
        }

        // Nếu email chưa tồn tại, gửi OTP
        await sendOtpToEmail(formData.email);  // Gửi OTP qua email
        navigate("/verify", { state: formData });  // Chuyển hướng đến trang verify

      } catch (error) {
        console.error(error);
        setError("Failed to send OTP. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <>
      <style>{slideInStyles}</style>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden lg:block lg:w-1/2 h-screen animate-slide-in-left">
          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="h-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.image}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Sign up and start learning
            </h2>
            <div className="mt-8">
              <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50">
                <FaGoogle className="h-5 w-5 text-[#DB4437] mr-2" />
                Continue with Google
              </button>

              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm">{errors.fullName}</p>
                  )}

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm">{errors.email}</p>
                  )}

                  <div className="relative">
                    <input
                      type={showPassword.password ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => togglePasswordVisibility("password")}
                    >
                      {showPassword.password ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

                  <div className="relative">
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                    >
                      {showPassword.confirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
                  {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-[#E41E3F] text-white rounded hover:bg-[#C41E3F]"
                >
                  {isSubmitting ? "Sending email verification..." : "Sign up"}
                </button>
              </form>

              <div className="mt-6">
                <p className="text-xs text-center text-gray-600">
                  By signing up, you agree to our{" "}
                  <a href="#" className="text-[#E41E3F]">
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#E41E3F]">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <div className="mt-6">
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#E41E3F] font-medium">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
