import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";

const routeTitles = {
  dashboard: "Dashboard Page",
  users: "User Page",
  courses: "Course Page",
  coupons: "Coupon Page",
  withdraws: "Withdraw Page",
  studies: "Study Page",
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const location = useLocation(); // 👈 lấy đường dẫn hiện tại

  const currentPath = location.pathname.split("/")[1]; // ví dụ /courses => courses
  const pageTitle = routeTitles[currentPath] || ""; 
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          minHeight: "100vh",
          background: "#001529",
          overflow: "hidden",
          transition: "max-width 0.3s ease",
          position: "fixed",
          zIndex: 1000,
          left: "0px",
          maxWidth: collapsed ? "0px" : "250px",
        }}
      >
        {!collapsed && <Sidebar />}
      </div>


      {/* Phần còn lại */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", marginLeft: collapsed ? "0" : "250px", transition: "margin-left 0.3s ease", overflowX: "hidden", paddingTop: "64px" }}>
        {/* Header có nút toggle */}
        <HeaderBar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Nội dung chính */}
        <div
          style={{
            flexGrow: 1,
            padding: 16,
            background: "white"
          }}
        >
          <div>
          <h3 style={{ fontWeight: "bold", marginBottom: 16 }}>{pageTitle} </h3>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
