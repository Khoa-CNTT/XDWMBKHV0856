import { useEffect, useState } from "react";
import CoursePurchaseHistory from "./CoursePurchaseHistory";
import ChangePassword from "./ChangePassword";
import MyProfile from "./MyProfile";
import LogOut from "./LogOut";
import Setting from "./Setting";
import TeacherRegister from "../../auth/teacherregister/TeacherRegister";

const UserProfilePage = () => {
  const [selectedPage, setSelectedPage] = useState(() => {
    // Lấy trang đã chọn từ localStorage hoặc mặc định là "MyProfile"
    const storedPage = localStorage.getItem("selectedPage");
    return storedPage ? storedPage : "MyProfile";
  });
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Danh sách menu
  const menuItems = [
    { title: "My Profile", page: "MyProfile" },
    { title: "Purchase History", page: "CoursePurchaseHistory" },
    { title: "Setting", page: "Setting" },
    { title: "Change Password", page: "ChangePassword" },
    { title: "Payment & Billing", page: "Payment", spacing: true },
    { title: "Instructor", page: "TeacherRegister" },
    { title: "Logout", page: "Logout" },
  ];

  const handleLogout = () => {
    console.log("User logged out");
    setIsLogoutOpen(false);
  };

  useEffect(() => {
    // lưu trữ trang đã chọn vào localStorage
    localStorage.setItem("selectedPage", selectedPage);
  }, [selectedPage]);

  return (
    <div className="flex max-w-7xl mx-auto mt-20">
      {/* Sidebar */}
      <div className={`bg-neutral-50 h-screen p-5 pt-8 duration-300 w-60`}>
        {/* Phần icon và tiêu đề */}
        <div className="inline-flex items-center">
          <h1
            className={`text-black-700 origin-left font-medium text-2xl duration-300 ${!open && "scale-0"
              }`}
          >
            Setting
          </h1>
        </div>

        {/* Danh sách menu */}
        <ul className="pt-2 mt-11">
          {menuItems.map((menu, index) => (
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
                } else {
                  setSelectedPage(menu.page);
                }
              }}
            >
              <span
                className={`text-base font-medium flex-1 duration-200 ${!open && "hidden"
                  }`}
              >
                {menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1">
        {selectedPage === "MyProfile" && <MyProfile />}
        {selectedPage === "ChangePassword" && <ChangePassword />}
        {selectedPage === "CoursePurchaseHistory" && <CoursePurchaseHistory />}
        {selectedPage === "TeacherRegister" && <TeacherRegister />}
        {selectedPage === "Setting" && <Setting />}

        {/* Popup đăng xuất */}
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
