import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoursePurchaseHistory from "./CoursePurchaseHistory";
import ChangePassword from "./ChangePassword";
import MyProfile from "./MyProfile";
import LogOut from "./LogOut";
import Setting from "./Setting";
import { useAuth } from "../../../contexts/AuthContext";

const UserProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState("MyProfile");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const baseMenuItems = [
    { title: "My Profile", page: "MyProfile" },
    { title: "Purchase History", page: "CoursePurchaseHistory" },
    { title: "Setting", page: "Setting" },
    { title: "Change Password", page: "ChangePassword" },
    { title: "Payment & Billing", page: "Payment", spacing: true },
    { title: "Logout", page: "Logout" },
  ];

  const instructorMenuItem =
    user?.role === "STUDENT"
      ? { title: "Create Instructor", page: "/instructor-register" }
      : ["INSTRUCTOR", "ADMIN", "ROOT"].includes(user?.role)
        ? { title: "Go Instructor", page: "/instructor/dashboard" }
        : null;

  const menuItems = instructorMenuItem
    ? [...baseMenuItems.slice(0, 5), instructorMenuItem, baseMenuItems[5]]
    : baseMenuItems;

  const handleLogout = () => {
    console.log("User logged out");
    setIsLogoutOpen(false);
  };

  return (
    <div className="flex max-w-7xl mx-auto mt-20">
      {/* Sidebar */}
      <div className={`bg-neutral-50 h-screen p-5 pt-8 duration-300 w-60`}>
        <div className="inline-flex items-center">
          <h1 className="text-black-700 font-medium text-2xl">Setting</h1>
        </div>

        <ul className="pt-2 mt-11">
          {menuItems.map((menu, index) => {
            const isRoute = menu.page.startsWith("/");

            return (
              <li
                key={index}
                className={`text-gray-800 text-sm flex items-center gap-x-4 cursor-pointer p-2 rounded-md mt-2 
                  ${selectedPage === menu.page
                    ? "text-red-500"
                    : "hover:bg-red-100 focus:outline-none"
                  }`}
                onClick={() => {
                  if (menu.page === "Logout") {
                    setIsLogoutOpen(true);
                  } else if (isRoute) {
                    navigate(menu.page); // điều hướng sang URL
                  } else {
                    setSelectedPage(menu.page); // nội dung trong component
                  }
                }}
              >
                <span className="text-base font-medium flex-1 duration-200">
                  {menu.title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1">
        {selectedPage === "MyProfile" && <MyProfile />}
        {selectedPage === "ChangePassword" && <ChangePassword />}
        {selectedPage === "CoursePurchaseHistory" && <CoursePurchaseHistory />}
        {selectedPage === "Setting" && <Setting />}

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
