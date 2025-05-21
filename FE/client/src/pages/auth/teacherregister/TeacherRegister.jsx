import React, { useEffect, useState } from "react";
import BankList from "./BankList";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getUser } from "../../../services/ProfileServices/MyProfile.services";
import { registerInstructor } from "../../../services/auth.services";

function TeacherRegister() {
  const { user, refreshUser } = useAuth();  // Lấy user từ AuthContext
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationFail, setRegistrationFail] = useState(false);
  const [bankAccountName, setBankAccountName] = useState("");
  const [failStatus, setFailStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [accountNumberInput, setAccountNumberInput] = useState("");


  // Sử dụng useEffect để gọi API khi user đã có thông tin
  useEffect(() => {
    if (user && user.id) {
      console.log("Fetching user info...");
      // Gọi hàm getUser để lấy thông tin chi tiết của người dùng
      const fetchUserData = async () => {
        const userData = await getUser(user.id);  // Sử dụng id của user từ AuthContext
        console.log("Fetched User Data:", userData);

        if (userData) {
          setFormData((prev) => ({
            ...prev,
            name: userData.fullName || "",
            phone: userData.phone || "",
            address: userData.address || "",
            bio: userData.bio || "",
          }));
          setPhoneInput(userData.phone || "");
        }
      };

      fetchUserData();  // Call the function to fetch user data
    }
  }, [user]);  // Chạy khi thông tin user thay đổi

  const handleInputChange = (e) => {
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

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    setPhoneInput(value);
    if (/^\d*$/.test(value)) {
      // ✅ chỉ cập nhật khi CHỈ CÓ SỐ hoặc rỗng
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    } else {
      // ❌ nếu có ký tự không phải số -> xóa `formData.phone`
      setFormData((prev) => ({
        ...prev,
        phone: "",
      }));
      setErrors((prev) => ({
        ...prev,
        phone: "OnLy Number!!!",
      }));
    }
  };

  const handleAccountNumberChange = (e) => {
    const { value } = e.target;
    setAccountNumberInput(value);
    if (/^\d*$/.test(value)) {
      setAccountNumber(value);
      setErrors((prev) => ({
        ...prev,
        accountNumber: "",
      }));
    } else {
      setAccountNumber(""); // reset nếu nhập không hợp lệ
      setErrors((prev) => ({
        ...prev,
        accountNumber: "OnLy Number!!!",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "You have not entered your name";
    }
    if (!formData.bio.trim()) {
      newErrors.bio = "You have not entered Bio";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "You Have Not Entered a Phone Number";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Only Number";
    }
    if (!formData.address.trim()) {
      newErrors.address = "You Have Not Entered An Address";
    }
    if (!selectedBank) {
      newErrors.bank = "Please Select Bank";
    }
    if (!accountNumber.trim()) {
      newErrors.accountNumber = "You Have Not Entered an Account Number";
    } else if (!/^\d+$/.test(accountNumber)) {
      newErrors.accountNumber = "Only Number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };
  const handleConfirm = async () => {
    setIsLoading(true); // Bắt đầu loading
    try {
      const instructorData = {
        id: user.id,
        fullName: formData.name,
        bio: formData.bio,
        address: formData.address,
        phone: formData.phone,
        bankInformation: {
          bank: selectedBank.code,
          account: accountNumber,
        },
      };

      const response = await registerInstructor(instructorData);
      await refreshUser();
      setBankAccountName(response.data.wallet.accountName || "");
      setShowConfirmation(false);
      setRegistrationComplete(true);
      setRegistrationFail(false);
      setFailStatus(null);
    } catch (error) {
      console.error("Error registering instructor:", error);
      setFailStatus(error?.status || null);
      setShowConfirmation(false);
      setRegistrationFail(true);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();
  const handleGoToInstructer = () => navigate("/instructor/dashboard");
  const handleGoBack = () => navigate('/student/account');

  return (
    <div className="min-h-screen h-auto flex justify-center items-center p-6 relative bg-gradient-to-r from-red-400 to-blue-600">
      <div className="bg-white/90 h-auto backdrop-blur-sm rounded-2xl shadow-lg w-full
       max-w-5xl flex flex-col md:flex-row overflow-hidden relative z-10 bg-gradient-to-r from-red-500 to-blue-600">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-6 space-y-3 border-b md:border-r md:border-b-0 bg-red-50">
          <button
            onClick={handleGoBack}
            type="button"
            className="text-sm text-primary hover:text-primary/80"
          >
            Back to Account Page
          </button>
          <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">
            Personal Information
          </h2>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Bio"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.bio ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.bio && (
                <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="phone"
                value={phoneInput}
                onChange={handlePhoneChange}
                placeholder="Phone Number"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.address ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-6 space-y-4 bg-white/50">
          <h2 className="text-xl font-semibold text-gray-700 text-center">
            Select Payment Bank
          </h2>
          <BankList
            onSelect={(bank) => {
              setSelectedBank(bank);
              if (errors.bank) {
                setErrors((prev) => ({ ...prev, bank: "" }));
              }
            }}
            selectedBank={selectedBank}
            error={errors.bank}
          />
          {selectedBank && (
            <div className="p-3 mt-2 bg-primary/5 border rounded text-primary text-sm">
              Selected: <strong>{selectedBank.short_name}</strong>
            </div>
          )}
          <div>
            <input
              type="text"
              placeholder="Bank account number"
              value={accountNumberInput}
              onChange={handleAccountNumberChange}
              className={`w-full p-2 border rounded mt-2 ${errors.accountNumber ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.accountNumber}
              </p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 font-semibold transition-colors duration-200"
          >
            Submit Registration
          </button>
        </div>
      </div>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md w-full animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Confirm Information</h3>
            <div className="space-y-2 mb-4">
              <p>
                <strong>Full Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Bio:</strong> {formData.bio}
              </p>
              <p>
                <strong>Phone Number:</strong> {formData.phone}
              </p>
              <p>
                <strong>Address:</strong> {formData.address}
              </p>
              <p>
                <strong>Bank Account:</strong> {selectedBank.short_name}
              </p>
              <p>
                <strong>Bank Account Number:</strong> {accountNumber}
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}


      {registrationComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md w-full animate-fade-in">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Registration Successful!
            </h3>
            <p className="text-sm text-center text-gray-700 mb-4">
              Bank Account Name: <span className="font-medium">{bankAccountName}</span>
            </p>
            <p className="text-center mb-4">
              Thank you for registering!!! You are now an E-Leaning instructor,
              go to the admin page to post your super courses
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleGoToInstructer}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors duration-200"
              >
                Go to Instructor Page
              </button>
            </div>
          </div>
        </div>
      )}
      {registrationFail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md w-full animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-center text-red-600">
              Registration Failed!
            </h3>

            {/* Show message based on fail status */}
            <p className="text-center mb-4 text-gray-700">
              {failStatus === 400
                ? "Unable to verify your bank account. Please double-check your bank name and account number."
                : "Registration failed. Please try again later."}
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setRegistrationFail(false);
                  setFailStatus(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherRegister;
