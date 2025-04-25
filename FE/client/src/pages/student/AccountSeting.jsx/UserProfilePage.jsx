import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CoursePurchaseHistory from "./CoursePurchaseHistory";
import SecuritySettings from "./SecuritySettings";
import MyProfile from "./MyProfile";
import LogOut from "./LogOut";
import Mycoupon from "./Mycoupon";
import { useAuth } from "../../../contexts/AuthContext";

const UserProfilePage = () => {
  const { user, handleLogout: logoutFromContext } = useAuth();
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState("MyProfile");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const baseMenuItems = [
    { title: "My Profile", page: "MyProfile" },
    { title: "Purchase History", page: "CoursePurchaseHistory" },
    { title: "My Coupon", page: "Mycoupon" },
    { title: "Privacy and security", page: "SecuritySettings" },
  ];

  const instructorMenuItem =
    user?.role === "STUDENT"
      ? { title: "Create Instructor", page: "/instructor-register" }
      : ["INSTRUCTOR", "ADMIN", "ROOT"].includes(user?.role)
        ? { title: "Instructor", page: "/instructor/dashboard" }
        : null;

  // Đảm bảo Logout luôn nằm ở cuối
  const menuItems = instructorMenuItem
    ? [...baseMenuItems, instructorMenuItem, { title: "Logout", page: "Logout" }]
    : [...baseMenuItems, { title: "Logout", page: "Logout" }];

  const handleLogout = async () => {
    await logoutFromContext();
    setIsLogoutOpen(false);
    navigate("/"); // chuyển về homepage sau khi logout
  };

  return (
    <div className="flex max-w-7xl mx-auto mt-20">
      {/* Sidebar */}
      <div className="bg-neutral-50 h-screen p-5 pt-8 duration-300 w-60">
        <div className="inline-flex items-center">
          <h1 className="text-black-700 font-medium text-2xl">Setting</h1>
        </div>

        <ul className="pt-2 mt-11 space-y-2">
          {menuItems.map((menu, index) => {
            const isRoute = typeof menu.page === "string" && menu.page.startsWith("/");
            const isSelected = selectedPage === menu.page;

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (menu.page === "Logout") {
                    setIsLogoutOpen(true);
                  } else if (isRoute) {
                    navigate(menu.page);
                  } else {
                    setSelectedPage(menu.page);
                  }
                }}
                className={`w-full text-left text-sm flex items-center gap-x-4 p-2 rounded-md 
                  ${isSelected ? "text-red-500" : "text-gray-800 hover:bg-red-100"} transition-all`}
              >
                <span className="text-base font-medium flex-1">{menu.title}</span>
              </motion.button>
            );
          })}
        </ul>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1">
        {selectedPage === "MyProfile" && <MyProfile />}
        {selectedPage === "SecuritySettings" && <SecuritySettings />}
        {selectedPage === "CoursePurchaseHistory" && <CoursePurchaseHistory />}
        {selectedPage === "Mycoupon" && <Mycoupon />}

        {/* Modal Logout */}
        {isLogoutOpen && (
          <LogOut
            isOpen={isLogoutOpen}
            onClose={() => setIsLogoutOpen(false)}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
