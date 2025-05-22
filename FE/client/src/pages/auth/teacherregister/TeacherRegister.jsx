import React, { useEffect, useState } from "react";
import BankList from "./BankList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getUser } from "../../../services/ProfileServices/MyProfile.services";
import { registerInstructor } from "../../../services/auth.services";
import { IoReturnUpBack } from "react-icons/io5";

function TeacherRegister() {
  const { user, refreshUser, handleLogout } = useAuth();
  const navigate = useNavigate();

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
  const [logoutCountdown, setLogoutCountdown] = useState(5);

  const handleLogoutNow = async () => {
    await handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    if (user && user.id) {
      const fetchUserData = async () => {
        const userData = await getUser(user.id);
        if (userData) {
          setFormData({
            name: userData.fullName || "",
            bio: userData.bio || "",
            phone: userData.phone || "",
            address: userData.address || "",
          });
          setPhoneInput(userData.phone || "");
        }
      };
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (registrationComplete) {
      const interval = setInterval(() => {
        setLogoutCountdown((prev) => {
          if (prev === 1) {
            handleLogoutNow();
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [registrationComplete]);

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
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    } else {
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
      setAccountNumber("");
      setErrors((prev) => ({
        ...prev,
        accountNumber: "OnLy Number!!!",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "You have not entered your name";
    if (!formData.bio.trim()) newErrors.bio = "You have not entered Bio";
    if (!formData.phone.trim()) {
      newErrors.phone = "You Have Not Entered a Phone Number";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Only Number";
    }
    if (!formData.address.trim()) newErrors.address = "You Have Not Entered An Address";
    if (!selectedBank) newErrors.bank = "Please Select Bank";
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
    setIsLoading(true);
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

  const handleGoBack = () => navigate('/student/account');

  return (
    <div className="bg-gradient-to-r from-red-400 to-blue-600">
      <button
        onClick={handleGoBack}
        type="button"
        className="absolute top-4 left-4 z-50 text-white hover:text-black/70 text-3xl p-3 rounded-full bg-opacity-80 shadow-md"
      >
        <IoReturnUpBack />
      </button>
      <div className="min-h-screen flex justify-center items-center p-6 relative">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg w-full max-w-5xl flex flex-col md:flex-row overflow-hidden relative z-10">
          {/* Left Section */}
          <div className="w-full mt-1 md:w-1/2 p-6 space-y-3 border-b md:border-r md:border-b-0 bg-red-50">

            <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">
              Personal Information
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className={`w-full p-2.5 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Bio"
                className={`w-full p-2.5 border rounded-lg ${errors.bio ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}

              <input
                type="text"
                name="phone"
                value={phoneInput}
                onChange={handlePhoneChange}
                placeholder="Phone Number"
                className={`w-full p-2.5 border rounded-lg ${errors.phone ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                className={`w-full p-2.5 border rounded-lg ${errors.address ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 p-6 space-y-4 bg-white/50">
            <h2 className="text-xl font-semibold text-gray-700 text-center">Select Payment Bank</h2>
            <BankList
              onSelect={(bank) => {
                setSelectedBank(bank);
                if (errors.bank) setErrors((prev) => ({ ...prev, bank: "" }));
              }}
              selectedBank={selectedBank}
              error={errors.bank}
            />
            {selectedBank && (
              <div className="p-3 mt-2 bg-primary/5 border rounded text-primary text-sm">
                Selected: <strong>{selectedBank.short_name}</strong>
              </div>
            )}
            <input
              type="text"
              placeholder="Bank account number"
              value={accountNumberInput}
              onChange={handleAccountNumberChange}
              className={`w-full p-2 border rounded ${errors.accountNumber ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
            )}
            <button
              onClick={handleSubmit}
              className="w-full mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 font-semibold transition-colors duration-200"
            >
              Submit Registration
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md w-full text-gray-800">
              <h3 className="text-lg font-semibold mb-4">Confirm Information</h3>
              <p><strong>Full Name:</strong> {formData.name}</p>
              <p><strong>Bio:</strong> {formData.bio}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Address:</strong> {formData.address}</p>
              <p><strong>Bank:</strong> {selectedBank?.short_name}</p>
              <p><strong>Account Number:</strong> {accountNumber}</p>
              <div className="flex justify-end mt-4 gap-2">
                <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                <button onClick={handleConfirm} className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Confirm</button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {/* Success Modal */}
        {registrationComplete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md w-full text-center text-gray-800">
              <h3 className="text-lg font-semibold mb-2 text-green-700">Instructor registration successful!</h3>
              <p className="mb-2">Account holder name: <strong>{bankAccountName}</strong></p>
              <p className="text-red-600 font-medium mb-4">
                You will be automatically logged out in <strong>{logoutCountdown}</strong> seconds to update access permissions.
              </p>
              <button onClick={handleLogoutNow} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                OK
              </button>
            </div>
          </div>
        )}

        {/* Fail Modal */}
        {registrationFail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md w-full text-center text-gray-800">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Registration Failed!</h3>
              <p className="mb-4">
                {failStatus === 400
                  ? "Unable to verify your bank account. Please double-check your bank name and account number."
                  : "Registration failed. Please try again later."}
              </p>
              <button onClick={() => { setRegistrationFail(false); setFailStatus(null); }} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherRegister;
