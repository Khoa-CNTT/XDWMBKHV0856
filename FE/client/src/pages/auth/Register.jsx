import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axios from "axios";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const handleSignup = () => {
  //   const URL_BACKEND = "http://localhost:8080/v1/email/register";
  //   const data = {
  //     loginName: formData.email,
  //   };

  //   const config = {
  //     withCredentials: true, // Quan trọng để xử lý cookie
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };

  //   return axios.post(URL_BACKEND, data, config);
  // };
  /////////////////// từ 36 tới 53 thêm vô để test hồi xóa
  const chuyentrang = () => navigate("/verify");

  //////////////
  const handleSignup = async (e) => {
    e.preventDefault(); // Ngăn form submit mặc định
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const URL_BACKEND = "http://localhost:8080/v1/email/register";
        const data = {
          loginName: formData.email,
        };
        const config = {
          withCredentials: true, // Quan trọng để xử lý cookie
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await axios.post(URL_BACKEND, data, config);

        if (response.data) {
          // Chuyển hướng đến trang verify và truyền email qua state
          navigate("/verify", {
            state: {
              email: formData.email,
            },
          });
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({
          submit:
            error.response?.data?.message ||
            "Registration failed. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Slider data
  const slides = [
    {
      image: "/images/slide1.jpg",
      title: "Learn from the best instructors",
      description:
        "Join our community of expert instructors and passionate learners",
    },
    {
      image: "/images/slide2.jpg",
      title: "Learn at your own pace",
      description:
        "Access courses anytime, anywhere, and learn at your convenience",
    },
    {
      image: "/images/slide3.jpg",
      title: "Diverse course selection",
      description: "Choose from thousands of courses in various fields",
    },
  ];

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/login");
      } catch (error) {
        setErrors({ submit: "Registration failed. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex h-screen">
      {" "}
      {/* Thêm h-screen để full màn hình */}
      {/* Left Side - Slider */}
      <div className="hidden lg:block lg:w-1/2 h-screen">
        {" "}
        {/* Thêm h-screen */}
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
          className="h-full" // Giữ nguyên h-full
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                {" "}
                {/* Giữ nguyên h-full */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center px-12 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Thêm min-h-screen và flex items-center justify-center */}
        <div className="w-full max-w-md space-y-8">
          {" "}
          {/* Điều chỉnh max-w và spacing */}
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Sign up and start learning
            </h2>
          </div>
          <div className="mt-8">
            {/* Google Login Button */}
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

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">{errors.password}</p>
                )}
              </div>

              <button
                // onClick={() => handleSignup()}
                // type="submit"
                onClick={handleSignup} // Thay đổi này
                type="button"
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
      <button className="text-[#E41E3F] font-medium" onClick={chuyentrang}>
        Verify
      </button>
    </div>
  );
};
export default Register;
