import React, { useState, useEffect } from "react";
import {
  FaShieldAlt,
  FaLock,
  FaChevronDown
} from "react-icons/fa";
import ChangePassword from "./ChangePassword";
import { updatePProtect } from "../../../services/user.services";
import { getCurrentUser } from "../../../services/auth.services";

const SecuritySettings = () => {
  const [protectionEnabled, setProtectionEnabled] = useState(false);
  const [userId, setUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isPasswordSectionVisible, setIsPasswordSectionVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user.id);
        const storedProtection = localStorage.getItem("protectionEnabled");
        setProtectionEnabled(storedProtection ? JSON.parse(storedProtection) : !!user.protect); // Đọc từ localStorage
      } catch (error) {
        setErrors((prev) => ({ ...prev, fetch: "Failed to fetch user" }));
        console.error("❌ Fetch user error:", error);
      }
    };

    fetchUser();
  }, []);

  const toggleProtection = async () => {
    if (!userId) return;

    try {
      const updatedUser = await updatePProtect(userId);
      localStorage.setItem("protectionEnabled", updatedUser.protect); // Lưu vào localStorage
      setProtectionEnabled(updatedUser.protect);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        protection: "Failed to update protection status",
      }));
      console.error("❌ Error updating protection:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-card rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-heading font-heading text-foreground mb-8 flex items-center gap-2">
          <FaShieldAlt className="text-primary" /> Security Settings
        </h1>

        {/* Account Protection */}
        <div className="mb-8 p-6 bg-secondary rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaLock className={`text-2xl ${protectionEnabled ? "text-chart-2" : "text-accent"}`} />
              <h2 className="text-lg font-semibold">Account Protection</h2>
            </div>

            {/* Toggle Protection */}
            <button
              onClick={toggleProtection}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${protectionEnabled ? "bg-chart-2" : "bg-accent"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${protectionEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Toggle Đổi mật khẩu */}
        <div className="mb-4">
          <button
            onClick={() => setIsPasswordSectionVisible(!isPasswordSectionVisible)}
            className="w-full flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <span className="font-semibold">Change Password</span>
            <FaChevronDown
              className={`transform transition-transform ${isPasswordSectionVisible ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>

        {/* Form đổi mật khẩu */}
        {isPasswordSectionVisible && (
          <div className="transition-all duration-300 ease-in-out">
            <ChangePassword />
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;
